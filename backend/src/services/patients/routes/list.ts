import { Hono } from "hono";
import { authMiddleware, requireRole } from "../../auth/middleware.js";
import database from "../../../postgres/connection.js";
import { users, personalData } from "../../../postgres/schema.js";
import { eq } from "drizzle-orm";
import { profileFields } from "../service.js";

const service = new Hono();

service.use(authMiddleware);

service.get("/", requireRole(["DOCTOR", "ADMIN"]), async (c) => {
  const patients = await database
    .select(profileFields)
    .from(users)
    .leftJoin(personalData, eq(users.id, personalData.userId))
    .where(eq(users.role, "USER"));

  return c.json(patients);
});

export default service;
