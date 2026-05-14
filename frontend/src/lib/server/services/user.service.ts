import api from "$lib/server/utils/api";

export async function onLoad(token: string) {
  const visitsRaw = await fetch(api("/visits"), {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const visits = await visitsRaw.json();

  const doctorsRaw = await fetch(api("/doctors"), {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const doctors = await doctorsRaw.json();

  const fullSlotsRes = await fetch(api("/visits/full-slots"), {
    headers: { Authorization: `Bearer ${token}` },
  });
  const fullSlots = await fullSlotsRes.json();

  const proceduresRaw = await fetch(api("/procedures"), {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const procedures = await proceduresRaw.json();

  const meRaw = await fetch(api("/auth/me"), {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const me = await meRaw.json();

  const imagesRaw = await fetch(api(`/patients/${me.id}/images`), {
    headers: { Authorization: `Bearer ${token}` },
  });
  const images = await imagesRaw.json();

  const imagesWithPreviews = await Promise.all(
    images.map(async (img: any) => {
      try {
        const res = await fetch(
          api(`/patients/${me.id}/images/${img.id}/download`),
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!res.ok) return img;

        const arrayBuffer = await res.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");

        const previewUrl = `data:${img.mimeType};base64,${base64}`;

        return { ...img, previewUrl };
      } catch {
        return img;
      }
    }),
  );

  const paymentsRaw = await fetch(api("/payments"), {
    headers: { Authorization: `Bearer ${token}` },
  });
  const payments = await paymentsRaw.json();

  return {
    doctors,
    visits,
    fullSlots,
    procedures,
    images: imagesWithPreviews,
    payments,
  };
}

export async function bookAppointment(token: string, formData: FormData) {
  const doctorIdRaw = formData.get("doctorId");
  const datetimeRaw = formData.get("datetime") as string;
  const description = formData.get("description");

  if (!datetimeRaw) return { success: false, error: "Invalid datetime" };
  const date = new Date(`${datetimeRaw}:00+02:00`);

  const res = await fetch(api("/visits"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      doctorId: Number(doctorIdRaw),
      dateTime: date.toISOString(),
      description,
      durationMinutes: 60,
    }),
  });

  const result = await res.json();
  if (!res.ok) return { success: false, error: result.error || "Server Error" };

  return { success: true, data: result };
}
export async function getDoctorAvailability(token: string, doctorId: string) {
  const res = await fetch(api(`/visits/doctor/${doctorId}/all-booked`), {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  return await res.json();
}
