import { Hono } from "hono";
import { authMiddleware } from "../../auth/middleware.js";
import database from "../../../postgres/connection.js";
import { users } from "../../../postgres/schema.js";
import { eq } from "drizzle-orm";
import { profileFields } from "../service.js";

const service = new Hono();

service.use(authMiddleware);

service.get("/:id", async (c) => {
  const user = c.get("user");
  const targetId = Number(c.req.param("id"));

  if (user.role === "PATIENT" && user.userId !== targetId) {
    return c.json({ error: "Forbidden" }, 403);
  }

  const [profile] = await database
    .select(profileFields)
    .from(users)
    .where(eq(users.id, targetId));

  if (!profile) {
    return c.json({ error: "Patient not found" }, 404);
  }

  return c.json(profile);
});

export default service;
