import { Hono } from "hono";
import { authMiddleware } from "../../auth/middleware.js";
import database from "../../../postgres/connection.js";
import { users } from "../../../postgres/schema.js";
import { eq } from "drizzle-orm";
import { profileFields, upsertPersonalData } from "../service.js";

const service = new Hono();
service.use(authMiddleware);

service.get("/me", async (c) => {
  const user = c.get("user");
  const [profile] = await database
    .select(profileFields)
    .from(users)
    .where(eq(users.id, user.userId));

  if (!profile) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json(profile);
});

service.patch("/me", async (c) => {
  const user = c.get("user");
  const { firstName, lastName, address, phoneNumber } = await c.req.json();

  await upsertPersonalData(user.userId, {
    firstName,
    lastName,
    address,
    phoneNumber,
  });

  return c.json({ success: true });
});

export default service;
