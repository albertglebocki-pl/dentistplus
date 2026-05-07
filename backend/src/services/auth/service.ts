import { sign } from "hono/jwt";

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set");
}

const STANDARD_EXPIRATION_DAYS = 1;
const EXTENDED_EXPIRATION_DAYS = 14;

const createToken = async (
  user: { id: number; role: string },
  rememberMe: boolean,
) => {
  return await sign(
    {
      userId: user.id,
      role: user.role,
      exp:
        Math.floor(Date.now() / 1000) +
        60 *
          60 *
          24 *
          (rememberMe ? EXTENDED_EXPIRATION_DAYS : STANDARD_EXPIRATION_DAYS),
    },
    JWT_SECRET,
  );
};

export default createToken;
