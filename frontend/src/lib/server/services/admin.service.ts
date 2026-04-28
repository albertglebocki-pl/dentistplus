import api from "$lib/server/utils/api";

export async function onLoad(token: string) {
  const usersRaw = await fetch(api("/admin/users"), {
    headers: { Authorization: `Bearer ${token}` },
  });

  const paymentsRaw = await fetch(api("/payments"), {
    headers: { Authorization: `Bearer ${token}` },
  });

  const proceduresRaw = await fetch(api("/catalog?includeInactive=true"), {
    headers: { Authorization: `Bearer ${token}` },
  });

  const users = await usersRaw.json();
  const payments = await paymentsRaw.json();
  const procedures = await proceduresRaw.json();

  return { users, payments, procedures };
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

export async function createDoctor(
  token: string,
  data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
  },
) {
  const res = await fetch(api("/admin/doctors"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    return {
      success: false,
      error: result.error || "Failed to create doctor",
    };
  }

  return { success: true, data: result };
}

export async function createProcedure(
  token: string,
  data: {
    name: string;
    description?: string;
    defaultCost?: number;
  },
) {
  const res = await fetch(api("/catalog"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    return {
      success: false,
      error: result.error || "Failed to create procedure",
    };
  }

  return { success: true, data: result };
}

export async function updateProcedure(
  token: string,
  id: string,
  data: {
    name?: string;
    description?: string;
    defaultCost?: number;
    active?: boolean;
  },
) {
  const res = await fetch(api(`/catalog/${id}`), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    return {
      success: false,
      error: result.error || "Failed to update procedure",
    };
  }

  return { success: true, data: result };
}

export async function deactivateProcedure(token: string, id: string) {
  const res = await fetch(api(`/catalog/${id}`), {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await res.json();

  if (!res.ok) {
    return {
      success: false,
      error: result.error || "Failed to deactivate procedure",
    };
  }

  return { success: true, data: result };
}
