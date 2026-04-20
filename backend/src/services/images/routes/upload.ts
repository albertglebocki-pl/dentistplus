import { Hono } from "hono";
import { authMiddleware, requireRole } from "../../auth/middleware.js";
import { PatientImage } from "../../../mongo/schema.js";
import { uploadToS3 } from "../service.js";
import { randomUUID } from "crypto";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 10;

const service = new Hono();

service.use(authMiddleware);

service.post("/:patientId/images", requireRole(["DOCTOR"]), async (c) => {
  const user = c.get("user");
  const patientId = Number(c.req.param("patientId"));

  const body = await c.req.parseBody();
  const file = body["file"];

  if (!file || typeof file === "string") {
    return c.json({ error: "No file attached" }, 400);
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return c.json(
      { error: "Unsupported format (Must be: .jpg, .png, .webp)" },
      415,
    );
  }

  const bytes = await file.arrayBuffer();

  if (bytes.byteLength > MAX_SIZE_MB * 1024 * 1024) {
    return c.json(
      { error: `Maximum upload size exceeded: ${MAX_SIZE_MB}MB` },
      413,
    );
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const s3Key = `patients/${patientId}/${randomUUID()}.${ext}`;

  await uploadToS3(s3Key, Buffer.from(bytes), file.type);

  const image = await PatientImage.create({
    patientId,
    s3Key,
    filename: file.name,
    mimeType: file.type,
    uploadedBy: user.userId,
  });

  return c.json(image, 201);
});

export default service;
