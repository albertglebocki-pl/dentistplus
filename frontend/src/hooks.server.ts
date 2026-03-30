import type { Handle } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import {
  verifyToken,
  COOKIE_NAME_EXPORT as COOKIE_NAME,
} from "$lib/server/auth";

const PROTECTED_ROUTES = ["/dashboard"];
const AUTH_ROUTES = ["/auth/login", "/auth/register"];

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get(COOKIE_NAME);
  event.locals.user = token ? verifyToken(token) : null;

  const { pathname } = event.url;

  if (event.locals.user && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    redirect(303, "/dashboard");
  }

  if (
    !event.locals.user &&
    PROTECTED_ROUTES.some((r) => pathname.startsWith(r))
  ) {
    redirect(303, "/auth/login");
  }

  return resolve(event);
};
