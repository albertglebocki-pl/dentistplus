import { ProcedureCatalog } from "../../mongo/schema.js";

export const validateTreatments = async (
  treatments: Array<{ tooth?: string; catalogItemId?: string; cost?: number }>,
) => {
  for (const treatment of treatments) {
    if (!treatment.tooth) {
      return "Procedure requires tooth specified";
    }

    if (treatment.catalogItemId) {
      const item = await ProcedureCatalog.findById(treatment.catalogItemId);

      if (!item || !item.active) {
        return `Treatment ${treatment.catalogItemId} does not exist or has been deactivated`;
      }
    }
  }

  return null;
};

export const sumCost = (treatments: Array<{ cost?: number }>): number =>
  treatments.reduce((s, t) => s + (t.cost ?? 0), 0);
