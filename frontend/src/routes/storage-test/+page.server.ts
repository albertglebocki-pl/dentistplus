import { redirect } from "@sveltejs/kit";
import api from "$lib/server/utils/api";

export async function load({ cookies, fetch }) {
  const token = cookies.get("token");

  if (!token) throw redirect(302, "/auth/login");

  const res = await fetch(api("/auth/me"), {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    cookies.delete("token", { path: "/" });
    throw redirect(302, "/auth/login");
  }

  const userData = await res.json();

  return {
    user: userData,
    token,
  };
}
