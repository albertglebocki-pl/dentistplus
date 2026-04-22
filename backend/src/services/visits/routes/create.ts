import { Hono } from "hono";
import { authMiddleware } from "../../auth/middleware.js";
import { Visit } from "../../../mongo/schema.js";
import { validateDoctor, checkConflict } from "../service.js";

const service = new Hono();

service.use(authMiddleware);

service.post("/", async (c) => {
  const user = c.get("user");
  const body = await c.req.json();

  let doctorId: number;
  let patientId: number;

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
  const durationMinutes: number = body.durationMinutes ?? 60;

  if (!doctorId || !patientId || isNaN(dateTime.getTime())) {
    return c.json(
      { error: "`doctorId`, `patientId` and valid `dateTime` are required" },
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
