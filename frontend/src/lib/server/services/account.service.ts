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

export async function changePassword(
  token: string,
  payload: {
    oldPassword: string;
    newPassword: string;
  },
) {
  const res = await fetch(api("/auth/me/password"), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok)
    return { success: false, error: data.error ?? "Failed to change password" };
  return { success: true };
}
