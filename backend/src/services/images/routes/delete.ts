import { Hono } from "hono";
import { authMiddleware, requireRole } from "../../auth/middleware.js";
import { PatientImage } from "../../../mongo/schema.js";
import { deleteFromS3 } from "../service.js";

const service = new Hono();

service.use(authMiddleware);

service.delete(
  "/:patientId/images/:imageId",
  requireRole(["DOCTOR"]),
  async (c) => {
    const patientId = Number(c.req.param("patientId"));

    const image = await PatientImage.findOne({
      _id: c.req.param("imageId"),
      patientId,
    });

    if (!image) {
      return c.json({ error: "Image not found" }, 404);
    }

    await deleteFromS3(image.s3Key);

    await image.deleteOne();

    return c.json({ success: true });
  },
);

export default service;
