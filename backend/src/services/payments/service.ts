import { Payment, MedicalProcedure } from "../../mongo/schema.js";

export const findPaymentByToken = (token: string) => Payment.findOne({ token });

export const findDoctorProcedureIds = async (doctorId: number) => {
  const procs = await MedicalProcedure.find({ doctorId }).select("_id");

  return procs.map((p) => p._id);
};

export const hasExistingPayment = (medicalProcedureId: string) =>
  Payment.findOne({
    medicalProcedureId,
    status: { $in: ["PENDING", "COMPLETED"] },
  });
