import api from "$lib/server/utils/api"
import {fail} from "@sveltejs/kit";

export async function onLoad(token: string) {
    const visitsRaw = await fetch(api("/visits"), {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        },
    })
    const visits = await visitsRaw.json();

    const doctorsRaw = await fetch(api("/doctors"), {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        },
    })
    const doctors = await doctorsRaw.json();

    return {visits: visits, doctors: doctors};
}

export async function bookAppointment(token: string, formData: FormData) {
    const doctorId = formData.get('doctorId');
    const datetime = formData.get('datetime');
    const description = formData.get('description');

    const res = await fetch(api("/visits"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            doctorId: Number(doctorId),
            dateTime: datetime,
            description: description,
            durationMinutes: 60,
        })
    });

    const result = await res.json();

    if (!res.ok) {
        return { success: false, error: result.error || "Internal Server Error" };
    }

    return { success: true, data: result };
}