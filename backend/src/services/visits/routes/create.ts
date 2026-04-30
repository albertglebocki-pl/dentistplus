import { Hono } from "hono";
import { authMiddleware } from "../../auth/middleware.js";
import { Visit } from "../../../mongo/schema.js";
import { validateDoctor, checkConflict } from "../service.js";

const service = new Hono();

service.use(authMiddleware);

function isValidISODateTime(value: any) {
  const d = new Date(value);
  return !isNaN(d.getTime());
}

function isWithinWorkingHours(date: Date) {
  const hours = date.getUTCHours();
  return hours >= 8 && hours < 18;
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
  const durationMinutes = body.durationMinutes ?? 60;
  const now = new Date();

  if (
    !doctorId ||
    !patientId ||
    !isValidISODateTime(body.dateTime) ||
    isNaN(dateTime.getTime())
  ) {
    return c.json(
      { error: "`doctorId`, `patientId` and valid `dateTime` are required" },
      400,
    );
  }

  if (dateTime < now) {
    return c.json({ error: "Cannot book in the past" }, 400);
  }

  if (!isWithinWorkingHours(dateTime)) {
    return c.json(
      { error: "Appointments allowed only between 08:00 and 18:00" },
      400,
    );
  }

  const doctor = await validateDoctor(doctorId);

  if (!doctor) {
    return c.json({ error: "Doctor not found" }, 404);
  }

  const conflict = await checkConflict(doctorId, dateTime, durationMinutes);

  if (conflict) {
    return c.json({ error: "Doctor is not available during this time" }, 409);
  }

  const visit = await Visit.create({
    doctorId,
    patientId,
    dateTime,
    durationMinutes,
    description: body.description,
    status: "BOOKED",
  });

  return c.json(visit, 201);
});

export default service;
