import { Hono } from "hono";
import { authMiddleware } from "../../auth/middleware.js";
import { PatientImage } from "../../../mongo/schema.js";
import { getPresignedUrl } from "../service.js";

const service = new Hono();

service.use(authMiddleware);

service.get("/:patientId/images", async (c) => {
  const user = c.get("user");
  const patientId = Number(c.req.param("patientId"));

  if (user.role === "PATIENT" && user.userId !== patientId) {
    return c.json({ error: "Forbidden" }, 403);
  }

  const images = await PatientImage.find({ patientId }).sort({ createdAt: -1 });

  const result = await Promise.all(
    images.map(async (img) => ({
      id: img._id,
      filename: img.filename,
      mimeType: img.mimeType,
      uploadedBy: img.uploadedBy,
      createdAt: img.createdAt,
      url: await getPresignedUrl(img.s3Key),
    })),
  );

  return c.json(result);
});

export default service;
