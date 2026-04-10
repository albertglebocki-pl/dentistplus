import type {Actions, PageServerLoad} from "./$types";
import {fail, redirect} from "@sveltejs/kit";
import {
    hashPassword,
    createUser,
    COOKIE_NAME_EXPORT as COOKIE_NAME,
} from "$lib/server/auth";
import {db} from "$lib/server/db";
import {users, personalData} from "$lib/server/schema";
import {getDoctors, getPatients} from "$lib/server/dbUtils";
import {eq} from "drizzle-orm";
import { getISOWeek } from "$lib/utils/date";


export const load: PageServerLoad = async ({locals, fetch}) => {
    if (!locals.user) redirect(303, "/auth/login");

    const doctors = await getDoctors()

    if (locals.user.role === "ADMIN") {
        const patients = await getPatients()

        return {user: locals.user, doctors, patients, calendarData: null};
    }

    const { year, week } = getISOWeek(new Date());
    const res = await fetch(`http://backend:3000/get-visits/${year}/${week}?doctorId=1&userId=${locals.user.sub}`);
    const json = await res.json();

    return {user: locals.user, doctors: doctors, patients: [], calendarData: json.calendarData};
};

export const actions: Actions = {
    addDoctor: async ({request, locals}) => {
        if (locals.user?.role !== "ADMIN") return fail(403, {error: "Forbidden"});

        const data = await request.formData();
        const email = String(data.get("email") ?? "").trim();
        const password = String(data.get("password") ?? "");
        const fullName = String(data.get("fullName") ?? "").trim();

        if (!email || !password || !fullName)
            return fail(400, {addError: "All fields are required."});
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            return fail(400, {addError: "Invalid email address."});
        if (password.length < 8)
            return fail(400, {addError: "Password must be at least 8 characters."});

        const existing = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);
        if (existing.length > 0)
            return fail(409, {
                addError: "An account with that email already exists.",
            });

        const passwordHash = await hashPassword(password);
        const user = await createUser(email, passwordHash, "DOCTOR");
        const [firstName, ...rest] = fullName.split(" ");
        await db.insert(personalData).values({
            userId: user.id,
            firstName,
            lastName: rest.join(" ") || null,
        });

        return {success: "Doctor account created."};
    },

    toggleBlock: async ({request, locals}) => {
        if (locals.user?.role !== "ADMIN") return fail(403, {error: "Forbidden"});

        const data = await request.formData();
        const id = Number(data.get("id"));
        const active = data.get("active") === "true";

        if (!id) return fail(400, {error: "Invalid user ID."});

        await db.update(users).set({active: !active}).where(eq(users.id, id));
        return {success: "User status updated."};
    },

    logout: async ({cookies}) => {
        cookies.delete(COOKIE_NAME, {path: "/"});
        redirect(303, "/auth/login");
    },
};
