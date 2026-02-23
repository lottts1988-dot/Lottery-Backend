import { PutObjectCommand } from "@aws-sdk/client-s3";
import { spacesClient } from "../space";
import { v4 as uuid } from "uuid";
import { prisma } from "../utils/prisma";

export class UploadRepo {
  public async uploadImages(files: Express.Multer.File[]) {
    const bucket = Bun.env.DO_SPACES_BUCKET!;
    const uploaded = [];

    for (const file of files) {
      const key = `uploads/${uuid()}-${file.originalname}`;

      await spacesClient.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: file.buffer,
          ACL: "public-read",
          ContentType: file.mimetype,
        }),
      );

      const url = `${Bun.env.DO_SPACES_ENDPOINT}/${bucket}/${key}`;

      const image = await prisma.image.create({
        data: { url, key },
      });

      uploaded.push(image);
    }
    return uploaded;
  }
}
