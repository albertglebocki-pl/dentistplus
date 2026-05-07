import api from "$lib/server/utils/api";

export async function getPayment(token: string, jwt: string) {
  const res = await fetch(api(`/payments/${token}`), {
    headers: { Authorization: `Bearer ${jwt}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch payment");

  return data;
}

export async function payPayment(token: string) {
  const res = await fetch(api(`/payments/pay/${token}`), {
    method: "POST",
  });

  const data = await res.json();
  return { ok: res.ok, data };
}

export async function failPayment(token: string) {
  const res = await fetch(api(`/payments/fail/${token}`), {
    method: "POST",
  });

  const data = await res.json();
  return { ok: res.ok, data };
}
