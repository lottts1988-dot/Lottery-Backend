import { PutObjectCommand } from "@aws-sdk/client-s3";
import { spacesClient } from "../space";
import { v4 as uuid } from "uuid";
import { prisma } from "../utils/prisma";

export class UploadRepo {
  public async uploadAdminImages(files: Express.Multer.File[], folder: string) {
    const bucket = process.env.DO_SPACES_BUCKET!;
    const uploaded = [];

    for (const file of files) {
      const key = `uploads/lottery/admin/${folder}/${file.originalname}-${uuid()}`;

      await spacesClient.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: file.buffer,
          ACL: "public-read",
          ContentType: file.mimetype,
        }),
      );

      const url = `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_REGION}.digitaloceanspaces.com/${key}`;

      const image = await prisma.image.create({
        data: { url, key },
      });

      uploaded.push(image);
    }
    return uploaded;
  }

  public async uploadImages(files: Express.Multer.File[]) {
    const bucket = process.env.DO_SPACES_BUCKET!;
    const uploaded = [];

    for (const file of files) {
      const key = `uploads/lottery/user/${file.originalname}-${uuid()}`;

      await spacesClient.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: file.buffer,
          ACL: "public-read",
          ContentType: file.mimetype,
        }),
      );

      const url = `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_REGION}.digitaloceanspaces.com/${key}`;

      const image = await prisma.image.create({
        data: { url, key },
      });

      uploaded.push(image);
    }
    return uploaded;
  }
}
