import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set");
}

export type AuthUser = {
  userId: number;
  role: "USER" | "DOCTOR" | "ADMIN";
  exp: number;
};

declare module "hono" {
  interface ContextVariableMap {
    user: AuthUser;
  }
}

export const authMiddleware = createMiddleware(async (context, next) => {
  const header = context.req.header("Authorization");

  if (!header) {
    return context.json({ error: "Unauthorized" }, 401);
  }

  const token = header.split(" ")[1];

  if (!token) {
    return context.json({ error: "Unauthorized" }, 401);
  }

  try {
    const payload = await verify(token, JWT_SECRET, "HS256");

    context.set("user", payload as AuthUser);

    await next();
  } catch {
    return context.json({ error: "Invalid or expired token" }, 401);
  }
});

export const requireRole = (roles: AuthUser["role"][]) =>
  createMiddleware(async (context, next) => {
    const user = context.get("user");

    if (!user) {
      return context.json({ error: "Unauthorized" }, 401);
    }

    if (!roles.includes(user.role)) {
      return context.json({ error: "Forbidden" }, 403);
    }

    await next();
  });
