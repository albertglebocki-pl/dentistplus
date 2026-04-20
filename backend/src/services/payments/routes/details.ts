import { Hono } from "hono";
import { authMiddleware } from "../../auth/middleware.js";
import { Payment, MedicalProcedure } from "../../../mongo/schema.js";

const service = new Hono();

service.use(authMiddleware);

service.get("/:id", async (c) => {
  const user = c.get("user");
  const payment = await Payment.findById(c.req.param("id")).populate(
    "medicalProcedureId",
  );

  if (!payment) {
    return c.json({ error: "Payment not found" }, 404);
  }

  if (user.role === "PATIENT" && payment.patientId !== user.userId) {
    return c.json({ error: "Forbidden" }, 403);
  }

  if (user.role === "DOCTOR") {
    const procedure = await MedicalProcedure.findById(
      payment.medicalProcedureId,
    );

    if (!procedure || procedure.doctorId !== user.userId) {
      return c.json({ error: "Forbidden" }, 403);
    }
  }

  return c.json(payment);
});

export default service;
