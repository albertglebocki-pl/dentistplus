import { Hono } from "hono";
import { authMiddleware } from "../../auth/middleware.js";
import { ProcedureCatalog } from "../../../mongo/schema.js";

const service = new Hono();

service.use(authMiddleware);

service.get("/", async (c) => {
  const user = c.get("user");
  const showAll =
    c.req.query("includeInactive") === "true" && user.role === "ADMIN";

  const items = await ProcedureCatalog.find(
    showAll ? {} : { active: true },
  ).sort({ name: 1 });

  return c.json(items);
});

export default service;
