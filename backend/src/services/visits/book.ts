import { Hono } from "hono";
import { Visit } from "../../mongo/schema.js";

const service = new Hono();

service.post("/visits/book", async (context) => {
  try {
    const details = await context.req.json();

    if (!details.userId || !details.doctorId || !details.datetime) {
      return context.json({ error: "Missing required fields!" }, 400);
    }

    const visit = await Visit.create({
      doctorId: details.doctorId,
      patientId: details.userId,
      dateTime:
        new Date(details.datetime).setMinutes(0, 0, 0) &&
        new Date(details.datetime),
      description: details.description,
      status: "BOOKED",
    });

    return context.json({ success: true, visit });
  } catch (error: any) {
    return context.json(
      {
        error:
          error.code === 11000 ? "Time slot booked already!" : "Server error!",
      },
      error.code === 11000 ? 409 : 500,
    );
  }
});

export default service;
