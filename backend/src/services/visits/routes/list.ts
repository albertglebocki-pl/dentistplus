import { Hono } from "hono";
import { authMiddleware } from "../../auth/middleware.js";
import { Visit } from "../../../mongo/schema.js";

const service = new Hono();

service.use(authMiddleware);

service.get("/", async (c) => {
  const user = c.get("user");
  const filter =
    user.role === "DOCTOR"
      ? { doctorId: user.userId }
      : { patientId: user.userId };

  const visits = await Visit.find(filter).sort({ dateTime: -1 });

  return c.json(visits);
});

export default service;
