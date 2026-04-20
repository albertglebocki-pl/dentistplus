import { Hono } from "hono";
import { authMiddleware, requireRole } from "../../auth/middleware.js";
import { findCatalogItem } from "../service.js";

const service = new Hono();
service.use(authMiddleware);

service.patch("/:id", requireRole(["ADMIN"]), async (c) => {
  const body = await c.req.json();
  const item = await findCatalogItem(c.req.param("id"));

  if (!item) {
    return c.json({ error: "Procedure not found" }, 404);
  }

  if (body.name !== undefined) {
    item.name = body.name;
  }

  if (body.description !== undefined) {
    item.descritpion = body.description;
  }

  if (body.defaultCost !== undefined) {
    item.defaultCost = body.defaultCost;
  }

  if (body.active !== undefined) {
    item.active = body.active;
  }

  await item.save();

  return c.json(item);
});

export default service;
