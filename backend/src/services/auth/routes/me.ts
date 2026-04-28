import { Hono } from "hono";
import database from "../../../postgres/connection.js";
import { users } from "../../../postgres/schema.js";
import { eq } from "drizzle-orm";
import { authMiddleware } from "../middleware.js";

const service = new Hono();

service.post("/me", authMiddleware, async (context) => {
  const authPayload = context.get("user");

  try {
    const [user] = await database
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
        active: users.active,
        createdAt: users.createdAt,
        firstName: users.firstName,
        lastName: users.lastName,
        address: users.address,
        phoneNumber: users.phoneNumber,
      })
      .from(users)
      .where(eq(users.id, authPayload.userId))
      .limit(1);

    if (!user) {
      return context.json({ error: "User not found" }, 404);
    }

    if (!user.active) {
      return context.json({ error: "Account is blocked" }, 403);
    }

    return context.json(user);
  } catch (error) {
    return context.json({ error: "Internal Server Error" }, 500);
  }
});

export default service;
