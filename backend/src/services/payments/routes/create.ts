import { Hono } from "hono";
import { authMiddleware, requireRole } from "../../auth/middleware.js";
import { Payment, MedicalProcedure } from "../../../mongo/schema.js";
import { hasExistingPayment } from "../service.js";

const service = new Hono();

service.use(authMiddleware);

service.post("/", requireRole(["DOCTOR"]), async (c) => {
  const user = c.get("user");
  const { medicalProcedureId, amount, successUrl, errorUrl } =
    await c.req.json();

  if (!medicalProcedureId || amount == null) {
    return c.json(
      { error: "`medicalProcedureId` and `amount` are required" },
      400,
    );
  }

  const procedure = await MedicalProcedure.findById(medicalProcedureId);

  if (!procedure) {
    return c.json({ error: "Procedure not found" }, 404);
  }

  if (procedure.doctorId !== user.userId) {
    return c.json({ error: "Forbidden" }, 403);
  }

  const existing = await hasExistingPayment(medicalProcedureId);

  if (existing) {
    return c.json({ error: "Payment for this procedure already exists" }, 409);
  }

  const payment = await Payment.create({
    patientId: procedure.patientId,
    medicalProcedureId,
    amount,
    successUrl,
    errorUrl,
    status: "PENDING",
  });

  return c.json(payment, 201);
});

export default service;
