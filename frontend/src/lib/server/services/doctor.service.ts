import api from "$lib/server/utils/api.ts";

export async function onLoad(token: string) {
    const visitsRaw = await fetch(api("/visits"), {
        method: "GET",
        headers: {Authorization: `Bearer ${token}`},
    });
    const visits = await visitsRaw.json();

    return {visits: visits};
}

export async function getPatientTreatments(token: string, patientId: string) {
    const treatmentsRaw = await fetch(api(`/procedures?patientId=${patientId}`), {
        method: "GET",
        headers: {Authorization: `Bearer ${token}`},
    })

    return await treatmentsRaw.json();
}

export async function getPatientVisits(token: string, patientId: string) {
    const visitsRaw = await fetch(api(`/visits/patient/${patientId}/all-booked`), {
        method: "GET",
        headers: {Authorization: `Bearer ${token}`},
    })

    return await visitsRaw.json();
}

export async function bookAppointment(token: string, formData: FormData) {
    const datetime = formData.get('datetime');
    const description = formData.get('description');
    const patientId = formData.get('patientId');

    const date = new Date(datetime);

    if(date < new Date()) {
        return {success: false, error: "Cannot book appointment in the past"};
    }

    const day = date.getDay();
    if(day == 0 || day == 6) {
        return {success: false, error: "Cannot book appointment in the weekend"};
    }

    const hour = date.getHours();
    if(hour < 8 || hour > 18) {
        return {success: false, error: "Hour have to be in range 8-18"};
    }

    const res = await fetch(api("/visits"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            patientId: patientId,
            dateTime: datetime,
            description: description,
            durationMinutes: 60
        }),
    })

    const result = await res.json();
    if(!res.ok) {
        return {success: false, error: result.error || "Internal Server Error"};
    }

    return {success: true, data: result};
}