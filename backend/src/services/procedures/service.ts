import { Patient, ProcedureCatalog } from "../../mongo/schema.js";

export const validateTreatments = async (
  treatments: Array<{ tooth?: string; catalogItemId?: string; cost?: number }>,
  patientId: number,
) => {
  const patient = await Patient.findOne({ patientId });

  for (const treatment of treatments) {
    if (!treatment.tooth) {
      return "Procedure requires tooth specified";
    }
    if (treatment.catalogItemId) {
      const item = await ProcedureCatalog.findById(treatment.catalogItemId);
      if (!item || !item.active) {
        return `Treatment ${treatment.catalogItemId} does not exist or has been deactivated`;
      }

      const toothStatus = patient?.toothStatusList.find(
        (ts: any) => ts.tooth === treatment.tooth,
      )?.status;

      if (toothStatus && item.blockedByStatuses?.includes(toothStatus)) {
        return `Tooth ${treatment.tooth} has status "${toothStatus}" — procedure "${item.name}" is not allowed.`;
      }
    }
  }
  return null;
};

export const sumCost = (treatments: Array<{ cost?: number }>): number =>
  treatments.reduce((s, t) => s + (t.cost ?? 0), 0);
