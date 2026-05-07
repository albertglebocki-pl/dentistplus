import { Hono } from "hono";
import { authMiddleware } from "../../auth/middleware.js";
import { Visit } from "../../../mongo/schema.js";

const service = new Hono();

service.use(authMiddleware);

service.post("/:id/cancel", async (c) => {
  const user = c.get("user");
  const visit = await Visit.findById(c.req.param("id"));

  if (!visit) {
    return c.json({ error: "Visit not found" }, 404);
  }

  if (visit.status !== "BOOKED") {
    return c.json({ error: "Only BOOKED visits can be cancelled" }, 400);
  }

  if (user.role === "USER" && visit.patientId !== user.userId) {
    return c.json({ error: "Forbidden" }, 403);
  }

  if (user.role === "DOCTOR" && visit.doctorId !== user.userId) {
    return c.json({ error: "Forbidden" }, 403);
  }

  visit.status = "CANCELLED";
  visit.cancelledAd = new Date();

  await visit.save();

  return c.json(visit);
});

export default service;
