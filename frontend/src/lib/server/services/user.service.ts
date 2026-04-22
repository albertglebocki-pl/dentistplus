import api from "$lib/server/utils/api"

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
    console.log("APPOINTMENT BOOK")
    console.log(formData)

    return {test: "booked"};
}