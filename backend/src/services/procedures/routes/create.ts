import { Hono } from "hono";
import { authMiddleware, requireRole } from "../../auth/middleware.js";
import { MedicalProcedure, Visit } from "../../../mongo/schema.js";
import { validateTreatments, sumCost } from "../service.js";
import { Types } from "mongoose";

const service = new Hono();

service.use(authMiddleware);

service.post("/", requireRole(["DOCTOR"]), async (c) => {
  const user = c.get("user");
  const { patientId, visitId, date, description, treatments } =
    await c.req.json();

  if (!patientId || !Array.isArray(treatments) || treatments.length === 0) {
    return c.json({ error: "`patientId` i `treatments` are required" }, 400);
  }

  const validationError = await validateTreatments(treatments);

  if (validationError) {
    return c.json({ error: validationError }, 400);
  }

  const procedure = await MedicalProcedure.create({
    patientId,
    doctorId: user.userId,
    date: date ? new Date(date) : new Date(),
    description,
    treatments,
  });

  if (visitId) {
    const visit = await Visit.findById(visitId);

    if (
      visit &&
      visit.status === "BOOKED" &&
      visit.doctorId === user.userId &&
      visit.patientId === patientId
    ) {
      visit.status = "COMPLETED";
      visit.medicalProcedureId = procedure._id as Types.ObjectId;
      await visit.save();
    }
  }

  return c.json(procedure, 201);
});

export default service;
