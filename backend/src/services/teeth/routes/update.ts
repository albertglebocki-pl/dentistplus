import { Hono } from "hono";
import { authMiddleware, requireRole } from "../../auth/middleware.js";
import { Patient } from "../../../mongo/schema.js";
import { updateSingleTooth } from "../service.js";

const service = new Hono();

service.use(authMiddleware);

service.put("/:patientId/teeth", requireRole(["DOCTOR"]), async (c) => {
  const patientId = Number(c.req.param("patientId"));
  const { toothStatusList } = await c.req.json();

  if (!Array.isArray(toothStatusList)) {
    return c.json({ error: "`toothStatusList` must be an array" }, 400);
  }

  const patient = await Patient.findOneAndUpdate(
    { patientId },
    { $set: { toothStatusList } },
    { new: true, upsert: true },
  );

  return c.json(patient.toothStatusList);
});

service.patch(
  "/:patientId/teeth/:tooth",
  requireRole(["DOCTOR"]),
  async (c) => {
    const patientId = Number(c.req.param("patientId"));
    const tooth = c.req.param("tooth");
    const { status } = await c.req.json();

    if (!status) {
      return c.json({ error: "`status` is required" }, 400);
    }

    const patient = await updateSingleTooth(patientId, tooth, status);

    return c.json(patient?.toothStatusList);
  },
);

export default service;
