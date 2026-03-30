import type { RequestHandler } from "./$types";
import { redirect } from "@sveltejs/kit";
import {
  COOKIE_NAME_EXPORT as COOKIE_NAME,
  cookieOptions,
} from "$lib/server/auth";

export const POST: RequestHandler = ({ cookies }) => {
  cookies.set(COOKIE_NAME, "", { ...cookieOptions(0) });
  redirect(303, "/auth/login");
};
