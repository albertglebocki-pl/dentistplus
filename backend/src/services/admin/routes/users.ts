import { Hono } from "hono";
import { authMiddleware, requireRole } from "../../auth/middleware.js";
import connection from "../../../postgres/connection.js";
import { users } from "../../../postgres/schema.js";
import { eq } from "drizzle-orm";

const service = new Hono();

service.use(authMiddleware);

service.patch("/users/:id/block", requireRole(["ADMIN"]), async (context) => {
  const id = Number(context.req.param("id"));

  if (!id) {
    return context.json({ error: "Invalid user id" }, 400);
  }

  const [updated] = await connection
    .update(users)
    .set({ active: false })
    .where(eq(users.id, id))
    .returning();

  if (!updated) {
    return context.json({ error: "User not found" }, 404);
  }

  return context.json({
    message: "User blocked",
    user: {
      id: updated.id,
      email: updated.email,
      active: updated.active,
    },
  });
});

service.patch("/users/:id/unblock", requireRole(["ADMIN"]), async (context) => {
  const id = Number(context.req.param("id"));

  if (!id) {
    return context.json({ error: "Invalid user id" }, 400);
  }

  const [updated] = await connection
    .update(users)
    .set({ active: true })
    .where(eq(users.id, id))
    .returning();

  if (!updated) {
    return context.json({ error: "User not found" }, 404);
  }

  return context.json({
    message: "User unblocked",
    user: {
      id: updated.id,
      email: updated.email,
      active: updated.active,
    },
  });
});

export default service;
