import { Hono } from "hono";
import { authMiddleware, requireRole } from "../../auth/middleware.js";
import { deactivateCatalogItem } from "../service.js";

const service = new Hono();

service.use(authMiddleware);

service.delete("/:id", requireRole(["ADMIN"]), async (c) => {
  const item = await deactivateCatalogItem(c.req.param("id"));

  if (!item) {
    return c.json({ error: "Procedure not found" }, 404);
  }

  return c.json({ message: "Procedure deactivated", item });
});

export default service;
