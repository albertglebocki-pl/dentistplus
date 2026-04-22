import { Hono } from "hono";
import { authMiddleware } from "../../auth/middleware.js";
import database from "../../../postgres/connection.js";
import { users } from "../../../postgres/schema.js";
import { eq } from "drizzle-orm";


const service = new Hono();

service.use(authMiddleware);

service.get("/", async(c) => {
    const doctors = await database
        .select()
        .from(users)
        .where(eq(users.role, "DOCTOR"));

    return c.json(doctors);
})

export default service;