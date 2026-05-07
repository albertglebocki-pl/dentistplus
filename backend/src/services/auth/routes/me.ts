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

service.patch("/me", authMiddleware, async (context) => {
  const authPayload = context.get("user");

  try {
    const body = await context.req.json();

    const allowedFields = {
      firstName: body.firstName,
      lastName: body.lastName,
      address: body.address,
      phoneNumber: body.phoneNumber,
      email: body.email,
    };

    const updateData = Object.fromEntries(
      Object.entries(allowedFields).filter(([_, v]) => v !== undefined),
    );

    if (Object.keys(updateData).length === 0) {
      return context.json({ error: "No valid fields provided" }, 400);
    }

    const [updated] = await database
      .update(users)
      .set(updateData)
      .where(eq(users.id, authPayload.userId))
      .returning({
        id: users.id,
        email: users.email,
        role: users.role,
        active: users.active,
        createdAt: users.createdAt,
        firstName: users.firstName,
        lastName: users.lastName,
        address: users.address,
        phoneNumber: users.phoneNumber,
      });

    return context.json(updated);
  } catch (error) {
    console.error(error);
    return context.json({ error: "Internal Server Error" }, 500);
  }
});

export default service;
