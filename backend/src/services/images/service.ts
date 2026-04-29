import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let s3: S3Client | null = null;
let bucket: string | null = null;

export const initS3Service = (client: S3Client, storageBucket: string) => {
  s3 = client;
  bucket = storageBucket;
};

const requireS3 = () => {
  if (!s3 || !bucket) {
    throw new Error("S3 not initialized. Call initS3Service() first.");
  }
  return { s3, bucket };
};

export const uploadToS3 = async (
  key: string,
  body: Buffer,
  mimeType: string,
) => {
  const { s3, bucket } = requireS3();

  return s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: mimeType,
    }),
  );
};

export const deleteFromS3 = async (key: string) => {
  const { s3, bucket } = requireS3();

  return s3.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
};

export const getPresignedUrl = async (key: string): Promise<string> => {
  const { s3, bucket } = requireS3();

  return getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
    { expiresIn: 3600 },
  );
};

export const getObjectFromS3 = async (key: string) => {
  const { s3, bucket } = requireS3();

  return s3.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
};
