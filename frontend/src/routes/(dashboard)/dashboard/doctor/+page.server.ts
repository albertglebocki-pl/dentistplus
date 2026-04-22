import { redirect } from "@sveltejs/kit";

export async function load({ cookies, fetch }) {
  const token = cookies.get("token");

  if (!token) throw redirect(302, "/auth/login");

  const res = await fetch("http://backend:3000/auth/me", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    cookies.delete("token", { path: "/" });
    throw redirect(302, "/auth/login");
  }

  const user = await res.json();

  if (user.role !== "DOCTOR") {
    throw redirect(302, "/dashboard");
  }

  return { user };
}
