import { Hono } from "hono";
import { authMiddleware } from "../../auth/middleware.js";
import { Visit } from "../../../mongo/schema.js";
import { checkConflict } from "../service.js";

const service = new Hono();

service.use(authMiddleware);

service.patch("/:id", async (c) => {
  const user = c.get("user");
  const visit = await Visit.findById(c.req.param("id"));

  if (!visit) {
    return c.json({ error: "Visit not found" }, 404);
  }

  if (visit.status !== "BOOKED") {
    return c.json({ error: "Only BOOKED visits can be changed" }, 400);
  }

  if (!visit.doctorId) {
    return c.json({ error: "Visit has no doctor assigned" }, 500);
  }

  if (user.role === "USER" && visit.patientId !== user.userId) {
    return c.json({ error: "Forbidden" }, 403);
  }

  if (user.role === "DOCTOR" && visit.doctorId !== user.userId) {
    return c.json({ error: "Forbidden" }, 403);
  }

  const { dateTime, durationMinutes, description } = await c.req.json();

  if (dateTime) {
    const newDate = new Date(dateTime);
    const duration: number = durationMinutes ?? visit.durationMinutes;
    const conflict = await checkConflict(
      visit.doctorId,
      newDate,
      duration,
      String(visit._id),
    );

    if (conflict) {
      return c.json({ error: "Doctor is not available during this time" }, 409);
    }

    visit.dateTime = newDate;

    if (durationMinutes) {
      visit.durationMinutes = durationMinutes;
    }
  }

  if (description !== undefined) {
    visit.description = description;
  }

  await visit.save();

  return c.json(visit);
});

export default service;
