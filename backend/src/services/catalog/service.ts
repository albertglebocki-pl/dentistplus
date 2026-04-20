import { ProcedureCatalog } from "../../mongo/schema.js";

export const findCatalogItem = (id: string) => ProcedureCatalog.findById(id);

export const deactivateCatalogItem = (id: string) =>
  ProcedureCatalog.findByIdAndUpdate(id, { active: false }, { new: true });
