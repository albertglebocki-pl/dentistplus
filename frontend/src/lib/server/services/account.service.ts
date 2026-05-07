import api from "$lib/server/utils/api";

export async function updateProfile(token: string, payload: any) {
  const res = await fetch(api("/auth/me"), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      error: data.error ?? "Failed to update profile",
    };
  }

  return {
    success: true,
    data,
  };
}
