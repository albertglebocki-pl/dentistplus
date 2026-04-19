import { Hono } from "hono";
import { authMiddleware } from "../../auth/middleware.js";
import { MedicalProcedure } from "../../../mongo/schema.js";

const service = new Hono();

service.use(authMiddleware);

service.get("/", async (c) => {
  const user = c.get("user");
  const patientIdQuery = c.req.query("patientId");
  let filter: Record<string, unknown> = {};

  if (user.role === "PATIENT") {
    filter = { patientId: user.userId };
  } else if (user.role === "DOCTOR") {
    filter = { doctorId: user.userId };

    if (patientIdQuery) {
      filter.patientId = Number(patientIdQuery);
    }
  } else if (patientIdQuery) {
    filter = { patientId: Number(patientIdQuery) };
  }

  const procedures = await MedicalProcedure.find(filter)
    .sort({ date: -1 })
    .populate("treatments.catalogItemId");

  return c.json(procedures);
});

export default service;
