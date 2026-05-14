import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import api from "$lib/server/utils/api";

export const actions: Actions = {
  default: async ({ request, fetch, cookies }) => {
    const data = await request.formData();
    const email = data.get("email");
    const password = data.get("password");
    const confirm = data.get("confirm");
    const fullName = data.get("fullName");
    const address = data.get("address");
    const phoneNumberRaw = data.get("phoneNumber");

    const nameParts = String(fullName)
      .trim()
      .split(" ")
      .filter((el) => el != "");
    const firstName = nameParts[0];
    const lastName = nameParts[1];

    if (password !== confirm) {
      return fail(400, { error: "Passwords are different" });
    }

    if (!firstName || !lastName) {
      return fail(400, { error: "First name and last name are required" });
    }

    console.log(JSON.stringify(phoneNumberRaw));
    console.log([...String(phoneNumberRaw ?? "")]);

    const phoneNumber = String(phoneNumberRaw ?? "")
        .trim()
        .replace(/\s+/g, "");

    const phoneRegex = /^\d{9}$/;

    if (!phoneRegex.test(phoneNumber)) {
      return fail(400, {
        error: "Phone number must consist of exactly 9 digits",
      });
    }

    const res = await fetch(api("/auth/register"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName,
        address,
        phoneNumber,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      return fail(res.status, {
        error: result.error || "Something went wrong",
      });
    }

    cookies.set("token", result.token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });

    throw redirect(303, "/dashboard");
  },
};
