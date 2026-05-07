import database from "../../postgres/connection.js";
import { users } from "../../postgres/schema.js";
import { eq } from "drizzle-orm";

export const profileFields = {
  id: users.id,
  email: users.email,
  role: users.role,
  active: users.active,
  createdAt: users.createdAt,
  firstName: users.firstName,
  lastName: users.lastName,
  address: users.address,
  phoneNumber: users.phoneNumber,
};

export const upsertPersonalData = async (
  userId: number,
  data: {
    firstName?: string;
    lastName?: string;
    address?: string;
    phoneNumber?: string;
  },
) => {
  await database.update(users).set(data).where(eq(users.id, userId));
};
