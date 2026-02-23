import { S3Client } from "@aws-sdk/client-s3";

export const spacesClient = new S3Client({
  region: Bun.env.DO_SPACES_REGION,
  endpoint: Bun.env.DO_SPACES_ENDPOINT,
  credentials: {
    accessKeyId: Bun.env.DO_SPACES_KEY!,
    secretAccessKey: Bun.env.DO_SPACES_SECRET!,
  },
});
