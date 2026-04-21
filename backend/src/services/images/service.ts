import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

const STORAGE_URL = process.env.STORAGE_URL!;
const STORAGE_BUCKET = process.env.STORAGE_BUCKET!;
const ACCESS_KEY = process.env.STORAGE_ACCESS_KEY!;
const SECRET_KEY = process.env.STORAGE_SECRET_KEY!;

// if (!STORAGE_URL || !STORAGE_BUCKET || !ACCESS_KEY || !SECRET_KEY) {
//   throw new Error("Could not establish connection to storage");
// }

export const isStorageConfigured =
    !!(STORAGE_URL && STORAGE_BUCKET && ACCESS_KEY && SECRET_KEY);

export const s3 = isStorageConfigured
    ? new S3Client({
        endpoint: STORAGE_URL,
        region: "garage",
        credentials: {
            accessKeyId: ACCESS_KEY,
            secretAccessKey: SECRET_KEY,
        },
        forcePathStyle: true,
    }) : null;

export const uploadToS3 = async (
    key: string,
    body: Buffer,
    mimeType: string,
) => {
    await s3.send(
        new PutObjectCommand({
            Bucket: STORAGE_BUCKET,
            Key: key,
            Body: body,
            ContentType: mimeType,
        }),
    );
};

export const deleteFromS3 = async (key: string) => {
    await s3.send(
        new DeleteObjectCommand({
            Bucket: STORAGE_BUCKET,
            Key: key,
        }),
    );
};

export const getPresignedUrl = async (key: string): Promise<string> => {
    return getSignedUrl(
        s3,
        new GetObjectCommand({Bucket: STORAGE_BUCKET, Key: key}),
        {expiresIn: 3600},
    );
};
