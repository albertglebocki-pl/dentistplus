import api from "$lib/server/utils/api.ts";

export async function onLoad(token: string) {
    const visitsRaw = await fetch(api("/visits"), {
        method: "GET",
        headers: {Authorization: `Bearer ${token}`},
    });
    const visits = await visitsRaw.json();

    return {visits: visits};
}