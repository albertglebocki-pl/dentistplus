import {Hono} from "hono";
import {authMiddleware} from "../../auth/middleware.js";
import {Visit} from "../../../mongo/schema.js";
import {validateDoctor, checkConflict} from "../service.js";

const service = new Hono();
service.use(authMiddleware);

function getWarsawHour(date: Date) {
    const formatter = new Intl.DateTimeFormat("en-GB", {
        hour: "numeric",
        hour12: false,
        timeZone: "Europe/Warsaw",
    });
    return parseInt(formatter.format(date), 10);
}

service.post("/", async (c) => {
    const user = c.get("user");
    const body = await c.req.json();

    let doctorId;
    let patientId;

    if (user.role === "USER") {
        doctorId = Number(body.doctorId);
        patientId = user.userId;
    } else if (user.role === "DOCTOR") {
        doctorId = user.userId;
        patientId = Number(body.patientId);
    } else {
        return c.json({ error: "Forbidden" }, 403);
    }

    const dateTime = new Date(body.dateTime);
    const now = new Date();

    if (isNaN(dateTime.getTime())) {
        return c.json({error: "Invalid date"}, 400);
    }

    const localHour = getWarsawHour(dateTime);
    if (localHour < 8 || localHour > 18) {
        return c.json({error: "Appointments allowed only between 08:00 and 18:00 Warsaw time"}, 400);
    }

    if (dateTime < now) {
        return c.json({error: "Cannot book in the past"}, 400);
    }

    const doctor = await validateDoctor(doctorId);
    if (!doctor) return c.json({error: "Doctor not found"}, 404);

    const conflict = await checkConflict(doctorId, dateTime, body.durationMinutes || 60);

    if (conflict) {
        return c.json({error: "Doctor is busy at this time"}, 409);
    }

    const adjustedDateTime = new Date(dateTime.getTime() + (2 * 60 * 60 * 1000));

    const visit = await Visit.create({
        doctorId,
        patientId,
        dateTime: adjustedDateTime,
        durationMinutes: body.durationMinutes || 60,
        description: body.description,
        status: "BOOKED",
    });

    return c.json(visit, 201);
});
;

export default service;