import api from "$lib/server/utils/api";

export async function onLoad(token: string) {
  const usersRaw = await fetch(api("/admin/users"), {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const users = await usersRaw.json();

  return { users };
}

export async function toggleUser(
  token: string,
  userId: number,
  active: boolean,
) {
  const endpoint = active
    ? `/admin/users/${userId}/block`
    : `/admin/users/${userId}/unblock`;

  const res = await fetch(api(endpoint), {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await res.json();

  if (!res.ok) {
    return {
      success: false,
      error: result.error || "Failed to update user",
    };
  }

  return { success: true, data: result };
}
