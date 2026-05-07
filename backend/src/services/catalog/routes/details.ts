import { Hono } from "hono";
import { authMiddleware } from "../../auth/middleware.js";
import { findCatalogItem } from "../service.js";

const service = new Hono();

service.use(authMiddleware);

service.get("/:id", async (c) => {
  const item = await findCatalogItem(c.req.param("id"));

  if (!item) {
    return c.json({ error: "Procedure not found" }, 404);
  }

  return c.json(item);
});

export default service;
