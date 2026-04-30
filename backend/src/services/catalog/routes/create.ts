import { Hono } from "hono";
import { authMiddleware, requireRole } from "../../auth/middleware.js";
import { ProcedureCatalog } from "../../../mongo/schema.js";

const service = new Hono();

service.use(authMiddleware);

service.post("/", requireRole(["ADMIN"]), async (c) => {
  const { name, description, defaultCost, setsToothStatus, blockedByStatuses } =
    await c.req.json();

  if (!name) {
    return c.json({ error: "Name is required" }, 400);
  }

  const item = await ProcedureCatalog.create({
    name,
    description,
    defaultCost,
    active: true,
    setsToothStatus: setsToothStatus ?? null,
    blockedByStatuses: blockedByStatuses ?? [],
  });

  return c.json(item, 201);
});

export default service;
