import { Hono } from "hono";
import { authMiddleware, requireRole } from "../../auth/middleware.js";
import connection from "../../../postgres/connection.js";
import { users } from "../../../postgres/schema.js";
import bcrypt from "bcryptjs";

const service = new Hono();

service.use(authMiddleware);

service.post("/doctors", requireRole(["ADMIN"]), async (context) => {
  const { email, password, firstName, lastName, phoneNumber } =
    await context.req.json();

  if (!email || !password) {
    return context.json({ error: "Email and password are required" }, 400);
  }

  if (password.length < 6) {
    return context.json({ error: "Password too short (min 6 chars)" }, 400);
  }

  const existing = await connection.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, email),
  });

  if (existing) {
    return context.json({ error: "Email already exists" }, 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const [doctor] = await connection
    .insert(users)
    .values({
      email,
      passwordHash,
      role: "DOCTOR",
      firstName,
      lastName,
      phoneNumber,
      active: true,
    })
    .returning();

  return context.json(
    {
      id: doctor.id,
      email: doctor.email,
      role: doctor.role,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
    },
    201,
  );
});

export default service;
