import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

let client: S3Client | null = null;

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function getConfig() {
  const accountId = requiredEnv("R2_ACCOUNT_ID");
  client ??= new S3Client({
    region: "auto",
    endpoint:
      process.env.R2_ENDPOINT?.trim() ||
      `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requiredEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: requiredEnv("R2_SECRET_ACCESS_KEY"),
    },
  });

  return { client, bucket: requiredEnv("R2_BUCKET_NAME") };
}

export async function uploadImage(key: string, file: File) {
  const { client, bucket } = getConfig();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: new Uint8Array(await file.arrayBuffer()),
      ContentType: file.type,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );
}

export async function readImage(key: string) {
  const { client, bucket } = getConfig();
  return client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
}
