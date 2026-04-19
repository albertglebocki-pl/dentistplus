import { sign } from "hono/jwt";

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set");
}

const createToken = async (user: { id: number; role: string }) => {
  return await sign(
    {
      userId: user.id,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    },
    JWT_SECRET,
  );
};

export default createToken;
