import { Hono } from "hono";
import { authMiddleware } from "../../auth/middleware.js";
import { getOrCreatePatient } from "../service.js";

const service = new Hono();

service.use(authMiddleware);

service.get("/:patientId/teeth", async (c) => {
  const user = c.get("user");
  const patientId = Number(c.req.param("patientId"));

  if (user.role === "USER" && user.userId !== patientId) {
    return c.json({ error: "Forbidden" }, 403);
  }

  const patient = await getOrCreatePatient(patientId);

  return c.json(patient.toothStatusList);
});

export default service;
