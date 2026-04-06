import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import {
  isFirstUser,
  getUserByEmail,
  createUser,
  hashPassword,
  signToken,
  cookieOptions,
  COOKIE_NAME_EXPORT as COOKIE_NAME,
} from "$lib/server/auth";
import { db } from "$lib/server/db";
import { personalData } from "$lib/server/schema";

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) redirect(303, "/dashboard");
  return {};
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();

    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const confirm = String(data.get("confirm") ?? "");
    const fullName = String(data.get("fullName") ?? "").trim();
    const address = String(data.get("address") ?? "").trim();
    const phone = String(data.get("phoneNumber") ?? "").trim();

    if (!email || !password || !confirm || !fullName || !address || !phone)
      return fail(400, { error: "All fields are required.", email, step: 2 });

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return fail(400, { error: "Invalid email address.", email, step: 1 });

    if (password.length < 8)
      return fail(400, {
        error: "Password must be at least 8 characters.",
        email,
        step: 1,
      });

    if (password !== confirm)
      return fail(400, { error: "Passwords do not match.", email, step: 1 });

    if (await getUserByEmail(email))
      return fail(409, {
        error: "An account with that email already exists.",
        email,
        step: 1,
      });

    const role = (await isFirstUser()) ? "ADMIN" : "USER";
    const passwordHash = await hashPassword(password);
    const user = await createUser(email, passwordHash, role);

    const [firstName, ...rest] = fullName.split(" ");
    await db.insert(personalData).values({
      userId: user.id,
      firstName,
      lastName: rest.join(" ") || null,
      address,
      phoneNumber: phone,
    });

    const token = signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    cookies.set(COOKIE_NAME, token, cookieOptions());

    redirect(303, "/dashboard");
  },
};
