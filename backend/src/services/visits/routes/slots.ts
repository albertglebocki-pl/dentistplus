import {Hono} from "hono";
import {authMiddleware} from "../../auth/middleware.js";
import {Visit} from "../../../mongo/schema.js";
import database from "../../../postgres/connection.js";
import {users} from "../../../postgres/schema.js";
import {eq, count} from "drizzle-orm";

const service = new Hono();

service.use(authMiddleware);

service.get("/doctor/:doctorId/slots", async (c) => {
    const doctorId = Number(c.req.param("doctorId"));
    const dateStr = c.req.query("date");

    if (!dateStr) {
        return c.json({error: "Date required: ?date=YYYY-MM-DD"}, 400);
    }

    const start = new Date(`${dateStr}T00:00:00.000Z`);
    const end = new Date(`${dateStr}T23:59:59.999Z`);

    const booked = await Visit.find({
        doctorId,
        status: "BOOKED",
        dateTime: {$gte: start, $lte: end},
    }).select("dateTime durationMinutes");

    return c.json({bookedSlots: booked});
});

service.get("/doctor/:doctorId/all-booked", authMiddleware, async (c) => {
    const doctorId = Number(c.req.param("doctorId"));
    const now = new Date();

    const bookedVisits = await Visit.find({
        doctorId,
        status: "BOOKED",
        dateTime: { $gte: now }
    }).select("dateTime");

    return c.json(bookedVisits);
});

service.get("/full-slots", async (c) => {
    try {
        const doctorsCountResult = await database
            .select({value: count()})
            .from(users)
            .where(eq(users.role, "DOCTOR"));

        const totalDoctors = doctorsCountResult[0]?.value ?? 0;

        if (totalDoctors === 0) return c.json([]);

        const fullSlots = await Visit.aggregate([
            {
                $match: { status: "BOOKED" }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%dT%H:%M:00.000Z", date: "$dateTime" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $match: { count: { $gte: totalDoctors } }
            },
            {
                $project: {
                    dateTime: { $toDate: "$_id" },
                    _id: 0
                }
            },
            { $sort: { dateTime: 1 } }
        ]);

        return c.json(fullSlots);
    } catch (err) {
        return c.json({error: "Internal Server Error"}, 500);
    }
});

export default service;
