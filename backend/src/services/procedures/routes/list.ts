import {Hono} from "hono";
import {authMiddleware} from "../../auth/middleware.js";
import {MedicalProcedure} from "../../../mongo/schema.js";

const service = new Hono();

service.use(authMiddleware);

service.get("/", async (c) => {
    const user = c.get("user");
    console.log("DEBUG: Obiekt user z middleware:", user);
    const patientIdQuery = c.req.query("patientId");
    let filter: Record<string, unknown> = {};

    const currentUserId = Number(user.userId);

    if (user.role === "USER") {
        filter = {patientId: currentUserId};
    } else if (user.role === "DOCTOR") {
        filter = {doctorId: currentUserId};
        if (patientIdQuery) {
            filter.patientId = Number(patientIdQuery);
        }
    } else if (patientIdQuery) {
        filter = {patientId: Number(patientIdQuery)};
    }

    const procedures = await MedicalProcedure.find(filter)
        .sort({date: -1})
        .populate("treatments.catalogItemId");

    return c.json(procedures);
});

export default service;
