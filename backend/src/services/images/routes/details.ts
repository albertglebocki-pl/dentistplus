import { Hono } from "hono";
import { authMiddleware } from "../../auth/middleware.js";
import { PatientImage } from "../../../mongo/schema.js";
import { getPresignedUrl } from "../service.js";

const service = new Hono();

service.use(authMiddleware);

service.get("/:patientId/images/:imageId", async (c) => {
  const user = c.get("user");
  const patientId = Number(c.req.param("patientId"));

  if (user.role === "USER" && user.userId !== patientId) {
    return c.json({ error: "Forbidden" }, 403);
  }

  const image = await PatientImage.findOne({
    _id: c.req.param("imageId"),
    patientId,
  });

  if (!image) {
    return c.json({ error: "Nie znaleziono zdjęcia" }, 404);
  }

  const url = await getPresignedUrl(image.s3Key);

  return c.json({
    id: image._id,
    filename: image.filename,
    mimeType: image.mimeType,
    uploadedBy: image.uploadedBy,
    createdAt: image.createdAt,
    url,
  });
});

export default service;
