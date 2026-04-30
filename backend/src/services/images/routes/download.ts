import { Hono } from "hono";
import { Types } from "mongoose";
import { authMiddleware } from "../../auth/middleware.js";
import { PatientImage } from "../../../mongo/schema.js";
import { getObjectFromS3 } from "../service.js";
import { Readable } from "stream";

const service = new Hono();

service.use(authMiddleware);

service.get("/:patientId/images/:imageId/download", async (c) => {
  const user = c.get("user");
  const patientId = Number(c.req.param("patientId"));
  const imageId = c.req.param("imageId");

  if (user.role === "USER" && user.userId !== patientId) {
    return c.json({ error: "Forbidden" }, 403);
  }

  const image = await PatientImage.findOne({
    _id: new Types.ObjectId(imageId),
    patientId,
  });

  if (!image) {
    return c.json({ error: "Image not found" }, 404);
  }

  const result = await getObjectFromS3(image.s3Key);

  if (!result.Body) {
    return c.json({ error: "Empty file" }, 500);
  }

  const body = result.Body as Readable;
  const stream = Readable.toWeb(body) as unknown as ReadableStream;

  return new Response(stream, {
    headers: {
      "Content-Type": image.mimeType,
      "Content-Disposition": `attachment; filename="${image.filename}"`,
    },
  });
});

export default service;
