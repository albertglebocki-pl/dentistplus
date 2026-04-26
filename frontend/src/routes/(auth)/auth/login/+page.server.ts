import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import api from "$lib/server/utils/api";

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = data.get("email");
    const password = data.get("password");
    const rememberMe = data.get("remember");

    const res = await fetch(api("/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, rememberMe }),
    });

    const result = await res.json();

    if (!res.ok) {
      return fail(401, { error: result.error || "Invalid credentials", email });
    }

    cookies.set("token", result.token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });

    throw redirect(303, "/dashboard");
  },
};
