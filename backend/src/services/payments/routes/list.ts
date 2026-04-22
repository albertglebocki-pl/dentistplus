import { Hono } from "hono";
import { authMiddleware } from "../../auth/middleware.js";
import { Payment } from "../../../mongo/schema.js";
import { findDoctorProcedureIds } from "../service.js";

const service = new Hono();

service.use(authMiddleware);

service.get("/", async (c) => {
  const user = c.get("user");

  if (user.role === "USER") {
    const payments = await Payment.find({ patientId: user.userId })
      .sort({ createdAt: -1 })
      .populate("medicalProcedureId");

    return c.json(payments);
  }

  if (user.role === "DOCTOR") {
    const ids = await findDoctorProcedureIds(user.userId);

    const payments = await Payment.find({ medicalProcedureId: { $in: ids } })
      .sort({ createdAt: -1 })
      .populate("medicalProcedureId");

    return c.json(payments);
  }

  const payments = await Payment.find({})
    .sort({ createdAt: -1 })
    .populate("medicalProcedureId");

  return c.json(payments);
});

export default service;
