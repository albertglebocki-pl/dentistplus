import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const STORAGE_URL = process.env.STORAGE_URL!;
const STORAGE_BUCKET = process.env.STORAGE_BUCKET!;
const ACCESS_KEY = process.env.STORAGE_KEY_ID!;
const SECRET_KEY = process.env.STORAGE_SECRET_KEY!;

export const isStorageConfigured = !!(
  STORAGE_URL &&
  STORAGE_BUCKET &&
  ACCESS_KEY &&
  SECRET_KEY
);

export const s3 = isStorageConfigured
  ? new S3Client({
      endpoint: STORAGE_URL,
      region: "garage",
      credentials: {
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_KEY,
      },
      forcePathStyle: true,
    })
  : null;

export const uploadToS3 = async (
  key: string,
  body: Buffer,
  mimeType: string,
) => {
  console.log("S3 CONFIG", {
    bucket: STORAGE_BUCKET,
    endpoint: STORAGE_URL,
    access: ACCESS_KEY,
    secret: SECRET_KEY,
    hasClient: !!s3,
  });

  if (!s3) {
    throw new Error("S3 is not configured");
  }

  return s3.send(
    new PutObjectCommand({
      Bucket: STORAGE_BUCKET,
      Key: key,
      Body: body,
      ContentType: mimeType,
    }),
  );
};

export const deleteFromS3 = async (key: string) => {
  if (!s3) throw new Error("S3 is not configured");

  return s3.send(
    new DeleteObjectCommand({
      Bucket: STORAGE_BUCKET,
      Key: key,
    }),
  );
};

export const getPresignedUrl = async (key: string): Promise<string> => {
  if (!s3) throw new Error("S3 is not configured");

  return getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: STORAGE_BUCKET, Key: key }),
    { expiresIn: 3600 },
  );
};
