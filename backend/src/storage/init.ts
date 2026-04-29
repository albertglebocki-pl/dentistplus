import { S3Client } from "@aws-sdk/client-s3";

export const initS3 = async (): Promise<S3Client> => {
  const adminToken = process.env.GARAGE_ADMIN_TOKEN!;
  const baseUrl = "http://storage:3903";

  const keyRes = await fetch(`${baseUrl}/v1/key`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${adminToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: "backend-runtime" }),
  });

  const key = await keyRes.json();

  // console.log("NEW KEY:", key);

  const bucketRes = await fetch(
    `${baseUrl}/v1/bucket?globalAlias=${process.env.STORAGE_BUCKET}`,
    {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    },
  );

  const bucketData = await bucketRes.json();
  const bucketId = bucketData.id;

  // console.log("BUCKET ID:", bucketId);

  await fetch(`${baseUrl}/v1/bucket/allow`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${adminToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bucketId,
      accessKeyId: key.accessKeyId,
      permissions: {
        read: true,
        write: true,
        owner: true,
      },
    }),
  });

  // console.log("KEY PERMISSIONS ATTACHED");

  return new S3Client({
    endpoint: process.env.STORAGE_URL!,
    region: "garage",
    forcePathStyle: true,
    credentials: {
      accessKeyId: key.accessKeyId,
      secretAccessKey: key.secretAccessKey,
    },
  });
};
