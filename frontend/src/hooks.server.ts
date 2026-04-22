import { redirect } from "@sveltejs/kit";
import type { Handle } from "@sveltejs/kit";

const AUTH_ROUTES = ["/auth/login", "/auth/register"];
const PROTECTED_ROUTES = ["/payments", "/dashboard"];

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get("token");
  const path = event.url.pathname;

  if (token && AUTH_ROUTES.some((route) => path.startsWith(route))) {
    throw redirect(303, "/dashboard");
  }

  if (!token && PROTECTED_ROUTES.some((route) => path.startsWith(route))) {
    throw redirect(303, "/auth/login");
  }

  return resolve(event);
};
