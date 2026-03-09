import type { UploadRepo } from "../repositories/upload";

export class UploadService {
  constructor(private uploadRepo: UploadRepo) {
    this.uploadRepo = uploadRepo;
  }

  public async uploadAdminImages(files: Express.Multer.File[], folder: string) {
    const uploadImages = await this.uploadRepo.uploadAdminImages(files, folder);
    return uploadImages;
  }

  public async uploadImages(files: Express.Multer.File[]) {
    const uploadImages = await this.uploadRepo.uploadImages(files);
    return uploadImages;
  }
}
