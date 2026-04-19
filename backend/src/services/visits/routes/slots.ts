import { Hono } from "hono";
import { authMiddleware } from "../../auth/middleware.js";
import { Visit } from "../../../mongo/schema.js";

const service = new Hono();

service.use(authMiddleware);

service.get("/doctor/:doctorId/slots", async (c) => {
  const doctorId = Number(c.req.param("doctorId"));
  const dateStr = c.req.query("date");

  if (!dateStr) {
    return c.json({ error: "Date required: ?date=YYYY-MM-DD" }, 400);
  }

  const start = new Date(`${dateStr}T00:00:00.000Z`);
  const end = new Date(`${dateStr}T23:59:59.999Z`);

  const booked = await Visit.find({
    doctorId,
    status: "BOOKED",
    dateTime: { $gte: start, $lte: end },
  }).select("dateTime durationMinutes");

  return c.json({ bookedSlots: booked });
});

export default service;
