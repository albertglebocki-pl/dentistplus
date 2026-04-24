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