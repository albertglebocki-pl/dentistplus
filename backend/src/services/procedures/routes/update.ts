import { Hono } from "hono";
import { authMiddleware, requireRole } from "../../auth/middleware.js";
import { MedicalProcedure } from "../../../mongo/schema.js";
import { sumCost } from "../service.js";

const service = new Hono();
service.use(authMiddleware);

service.patch("/:id", requireRole(["DOCTOR"]), async (c) => {
  const user = c.get("user");
  const procedure = await MedicalProcedure.findById(c.req.param("id"));

  if (!procedure) {
    return c.json({ error: "Procedure not found" }, 404);
  }

  if (procedure.doctorId !== user.userId) {
    return c.json({ error: "Forbidden" }, 403);
  }

  const { description, treatments, date } = await c.req.json();

  if (description !== undefined) {
    procedure.description = description;
  }

  if (date) {
    procedure.date = new Date(date);
  }

  if (Array.isArray(treatments)) {
    procedure.treatments = treatments as any;
  }

  await procedure.save();

  return c.json(procedure);
});

export default service;
