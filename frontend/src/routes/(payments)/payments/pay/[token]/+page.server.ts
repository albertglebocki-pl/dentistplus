import type { Actions } from "./$types";

const BACKEND_URL = process.env.VITE_BACKEND_URL ?? "http://backend:3000";

export const actions: Actions = {
  pay: async ({ params, fetch }) => {
    const res = await fetch(`${BACKEND_URL}/payments/pay/${params.token}`, {
      method: "POST",
    });

    return res.json();
  },

  fail: async ({ params, fetch }) => {
    const res = await fetch(`${BACKEND_URL}/payments/fail/${params.token}`, {
      method: "POST",
    });

    return res.json();
  },
};
