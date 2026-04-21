import type { RequestHandler } from "./$types";
import { redirect } from "@sveltejs/kit";

export const GET: RequestHandler = ({ cookies }) => {
    console.log("LOGOUT")

    cookies.delete("token", { path: "/" });
    redirect(303, "/auth/login");
};