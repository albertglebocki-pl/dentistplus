import {Hono} from "hono";
import {authMiddleware} from "../../auth/middleware.js";
import {Visit} from "../../../mongo/schema.js";
import database from "../../../postgres/connection.js";
import {users} from "../../../postgres/schema.js";
import {inArray} from "drizzle-orm";

const service = new Hono();

service.use(authMiddleware);

service.get("/", async (c) => {
    const user = c.get("user");

    const filter = user.role === "DOCTOR"
        ? {doctorId: user.userId}
        : {patientId: user.userId};

    const visits = await Visit.find(filter).lean().sort({dateTime: -1});

    if (user.role === "DOCTOR" && visits.length > 0) {
        const patientIds = [...new Set(visits.map(v => v.patientId))];

        const patientData = await database
            .select({
                id: users.id,
                firstName: users.firstName,
                lastName: users.lastName,
                email: users.email,
                phoneNumber: users.phoneNumber,
                address: users.address
            })
            .from(users)
            .where(inArray(users.id, patientIds));

        const patientsMap = Object.fromEntries(
            patientData.map(p => [p.id, p])
        );

        const enrichedVisits = visits.map(v => ({
            ...v,
            patient: patientsMap[v.patientId] || null
        }));

        return c.json(enrichedVisits);
    }

    return c.json(visits);
});

export default service;
