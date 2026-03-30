import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import {
  getUserByEmail,
  verifyPassword,
  signToken,
  cookieOptions,
  COOKIE_NAME_EXPORT as COOKIE_NAME,
} from "$lib/server/auth";

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) redirect(303, "/dashboard");
  return {};
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");

    if (!email || !password) {
      return fail(400, { error: "Email and password are required.", email });
    }

    const user = await getUserByEmail(email);

    const validPassword = user
      ? await verifyPassword(password, user.passwordHash)
      : await verifyPassword(
          password,
          "$2b$12$invalidhashfortimingnulluser00000",
        );

    if (!user || !validPassword) {
      return fail(401, { error: "Invalid email or password.", email });
    }

    const token = signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    cookies.set(COOKIE_NAME, token, cookieOptions());

    redirect(303, "/dashboard");
  },
};
