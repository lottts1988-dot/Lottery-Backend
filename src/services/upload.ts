import type { UploadRepo } from "../repositories/upload";

export class UploadService {
  constructor(private uploadRepo: UploadRepo) {
    this.uploadRepo = uploadRepo;
  }

  public async uploadAdminImages(file: Express.Multer.File, folder: string) {
    const uploadImages = await this.uploadRepo.uploadAdminImages(file, folder);
    return uploadImages;
  }

  public async uploadImages(file: Express.Multer.File) {
    const uploadImages = await this.uploadRepo.uploadImages(file);
    return uploadImages;
  }
}
