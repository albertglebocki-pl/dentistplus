import { Visit } from "../../mongo/schema.js";
import database from "../../postgres/connection.js";
import { users } from "../../postgres/schema.js";
import { eq, and } from "drizzle-orm";

export const validateDoctor = async (doctorId: number) => {
  const [doctor] = await database
    .select()
    .from(users)
    .where(and(eq(users.id, doctorId), eq(users.role, "DOCTOR")));

  return doctor ?? null;
};

export const checkConflict = async (
  doctorId: number,
  dateTime: Date,
  durationMinutes: number,
  excludeId?: string,
) => {
  const endTime = new Date(dateTime.getTime() + durationMinutes * 60_000);

  return Visit.findOne({
    ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    doctorId,
    status: "BOOKED",
    $expr: {
      $and: [
        { $lt: ["$dateTime", endTime] },
        {
          $gt: [
            {
              $add: ["$dateTime", { $multiply: ["$durationMinutes", 60_000] }],
            },
            dateTime,
          ],
        },
      ],
    },
  });
};
