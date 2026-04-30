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

  return { doctors, visits, fullSlots, procedures };
}

export async function bookAppointment(token: string, formData: FormData) {
  const doctorIdRaw = formData.get("doctorId");
  const datetimeRaw = formData.get("datetime");
  const description = formData.get("description");

  if (typeof doctorIdRaw !== "string") {
    return { success: false, error: "Invalid doctorId" };
  }

  if (typeof datetimeRaw !== "string") {
    return { success: false, error: "Invalid datetime" };
  }

  const date = new Date(datetimeRaw);

  if (date < new Date()) {
    return { success: false, error: "Cannot book appointment in the past" };
  }

  const day = date.getDay();
  if (day === 0 || day === 6) {
    return { success: false, error: "Cannot book appointment in the weekend" };
  }

  const hour = date.getHours();
  if (hour < 8 || hour > 18) {
    return { success: false, error: "Hour have to be in range 8-18" };
  }

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

  if (!res.ok) {
    return { success: false, error: result.error || "Internal Server Error" };
  }

  return { success: true, data: result };
}

export async function getDoctorAvailability(token: string, doctorId: string) {
  const res = await fetch(api(`/visits/doctor/${doctorId}/all-booked`), {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  return await res.json();
}
