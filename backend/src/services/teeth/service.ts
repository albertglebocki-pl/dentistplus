import { Patient } from "../../mongo/schema.js";

export const getOrCreatePatient = async (patientId: number) => {
  let patient = await Patient.findOne({ patientId });

  if (!patient) {
    patient = await Patient.create({ patientId, toothStatusList: [] });
  }

  return patient;
};

export const updateSingleTooth = async (
  patientId: number,
  tooth: string,
  status: string,
) => {
  let patient = await Patient.findOneAndUpdate(
    { patientId, "toothStatusList.tooth": tooth },
    { $set: { "toothStatusList.$.status": status } },
    { new: true },
  );

  if (!patient) {
    patient = await Patient.findOneAndUpdate(
      { patientId },
      { $push: { toothStatusList: { tooth, status } } },
      { new: true, upsert: true },
    );
  }

  return patient;
};
