import { Hono } from "hono";
import bcrypt from "bcryptjs";
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

service.patch("/me/password", authMiddleware, async (context) => {
  const authPayload = context.get("user");
  try {
    const body = await context.req.json();
    const { oldPassword, newPassword } = body;

    if (!oldPassword || !newPassword) {
      return context.json({ error: "Missing required fields" }, 400);
    }

    if (newPassword.length < 8) {
      return context.json(
        { error: "Password must be at least 8 characters" },
        400,
      );
    }

    const [user] = await database
      .select({ passwordHash: users.passwordHash })
      .from(users)
      .where(eq(users.id, authPayload.userId))
      .limit(1);

    if (!user) {
      return context.json({ error: "User not found" }, 404);
    }

    const valid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!valid) {
      return context.json({ error: "Invalid current password" }, 400);
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await database
      .update(users)
      .set({ passwordHash })
      .where(eq(users.id, authPayload.userId));

    return context.json({ success: true });
  } catch (error) {
    console.error(error);
    return context.json({ error: "Internal Server Error" }, 500);
  }
});

export default service;
