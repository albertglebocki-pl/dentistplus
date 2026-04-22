import type { PageServerLoad, Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";

const BACKEND_URL = process.env.VITE_BACKEND_URL ?? "http://backend:3000";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
  const token = cookies.get("token");

  if (!token) {
    throw redirect(302, "/auth/login");
  }

  // 🔐 pobierz usera (jak u Ciebie)
  const userRes = await fetch(`${BACKEND_URL}/auth/me`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!userRes.ok) {
    cookies.delete("token", { path: "/" });
    throw redirect(302, "/auth/login");
  }

  const user = await userRes.json();

  // 💰 pobierz płatności
  try {
    const paymentsRes = await fetch(`${BACKEND_URL}/payments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const payments = await paymentsRes.json();

    return {
      user,
      payments,
    };
  } catch {
    return {
      user,
      payments: [],
    };
  }
};

export const actions: Actions = {
  create: async ({ request, cookies, fetch }) => {
    const token = cookies.get("token");
    if (!token) throw redirect(302, "/auth/login");

    const data = await request.formData();

    const medicalProcedureId = data.get("medicalProcedureId");
    const amount = data.get("amount");
    const successUrl = data.get("successUrl");
    const errorUrl = data.get("errorUrl");

    if (!medicalProcedureId || !amount) {
      return fail(400, { error: "Wymagane pola." });
    }

    const res = await fetch(`${BACKEND_URL}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        medicalProcedureId,
        amount: parseFloat(amount.toString()),
        successUrl: successUrl || undefined,
        errorUrl: errorUrl || undefined,
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return fail(res.status, {
        error: body.error ?? "Błąd tworzenia płatności",
      });
    }

    return { success: true };
  },
};
