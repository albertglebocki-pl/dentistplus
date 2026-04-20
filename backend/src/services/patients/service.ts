import database from "../../postgres/connection.js";
import { users, personalData } from "../../postgres/schema.js";
import { eq } from "drizzle-orm";

export const profileFields = {
  id: users.id,
  email: users.email,
  role: users.role,
  active: users.active,
  createdAt: users.createdAt,
  firstName: personalData.firstName,
  lastName: personalData.lastName,
  address: personalData.address,
  phoneNumber: personalData.phoneNumber,
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
  const [existing] = await database
    .select()
    .from(personalData)
    .where(eq(personalData.userId, userId));

  if (!existing) {
    await database.insert(personalData).values({ userId, ...data });
  } else {
    await database
      .update(personalData)
      .set(data)
      .where(eq(personalData.userId, userId));
  }
};
