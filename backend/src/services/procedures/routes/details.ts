import { Hono } from "hono";
import { authMiddleware } from "../../auth/middleware.js";
import { MedicalProcedure } from "../../../mongo/schema.js";

const service = new Hono();

service.use(authMiddleware);

service.get("/:id", async (c) => {
  const user = c.get("user");
  const procedure = await MedicalProcedure.findById(c.req.param("id")).populate(
    "treatments.catalogItemId",
  );

  if (!procedure) {
    return c.json({ error: "Procedure not found" }, 404);
  }

  if (user.role === "USER" && procedure.patientId !== user.userId) {
    return c.json({ error: "Forbidden" }, 403);
  }

  if (user.role === "DOCTOR" && procedure.doctorId !== user.userId) {
    return c.json({ error: "Forbidden" }, 403);
  }

  return c.json(procedure);
});

export default service;
