import { Hono } from "hono";
import { authMiddleware } from "../../auth/middleware.js";
import { MedicalProcedure } from "../../../mongo/schema.js";

const service = new Hono();

service.use(authMiddleware);

service.get("/:patientId/teeth/:tooth/procedures", async (c) => {
  const user = c.get("user");
  const patientId = Number(c.req.param("patientId"));
  const tooth = c.req.param("tooth");

  if (user.role === "PATIENT" && user.userId !== patientId) {
    return c.json({ error: "Forbidden" }, 403);
  }

  const procedures = await MedicalProcedure.find({
    patientId,
    "treatments.tooth": tooth,
  })
    .sort({ date: -1 })
    .populate("treatments.catalogItemId");

  const result = procedures.map((proc) => ({
    procedureId: proc._id,
    date: proc.date,
    doctorId: proc.doctorId,
    treatments: proc.treatments.filter((t) => t.tooth === tooth),
  }));

  return c.json(result);
});

export default service;
