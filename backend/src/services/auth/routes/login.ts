import { Hono } from "hono";
import createToken from "../service.js";
import bcrypt from "bcryptjs";
import database from "../../../postgres/connection.js";
import { users } from "../../../postgres/schema.js";
import { eq } from "drizzle-orm";

const service = new Hono();

service.post("/login", async (context) => {
  const { email, password, rememberMe } = await context.req.json();

  if (!email || !password) {
    return context.json({ error: "Email and password required" }, 400);
  }

  const [user] = await database
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (!user) {
    return context.json({ error: "Invalid credentials" }, 401);
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);

  if (!validPassword) {
    return context.json({ error: "Invalid credentials" }, 401);
  }

  const token = await createToken(user, rememberMe);

  return context.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
});

export default service;
