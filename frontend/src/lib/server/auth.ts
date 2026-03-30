import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { db } from "$lib/server/db";
import { users } from "$lib/server/schema";
import { eq, count } from "drizzle-orm";
import { env } from "$env/dynamic/private";

const JWT_SECRET = env.JWT_SECRET;
const SALT_ROUNDS = 12;
const COOKIE_NAME = "auth_token";
const TOKEN_TTL = "7d";

export type JwtPayload = {
  sub: number;
  email: string;
  role: "USER" | "DOCTOR" | "ADMIN";
  iat?: number;
  exp?: number;
};

export const hashPassword = (plain: string) => bcrypt.hash(plain, SALT_ROUNDS);

export const verifyPassword = (plain: string, hash: string) =>
  bcrypt.compare(plain, hash);

export function signToken(payload: Omit<JwtPayload, "iat" | "exp">): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_TTL });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export const COOKIE_NAME_EXPORT = COOKIE_NAME;

export function cookieOptions(maxAge = 60 * 60 * 24 * 7) {
  return {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge,
  } as const;
}

export async function isFirstUser(): Promise<boolean> {
  const [{ value }] = await db.select({ value: count() }).from(users);
  return Number(value) === 0;
}

export async function getUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase().trim()))
    .limit(1);
  return user ?? null;
}

export async function createUser(
  email: string,
  passwordHash: string,
  role: "USER" | "ADMIN" = "USER",
) {
  const [user] = await db
    .insert(users)
    .values({ email: email.toLowerCase().trim(), passwordHash, role })
    .returning();
  return user;
}
