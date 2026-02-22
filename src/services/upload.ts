import type { UploadRepo } from "../repositories/upload";

export class UploadService {
  constructor(private uploadRepo: UploadRepo) {
    this.uploadRepo = uploadRepo;
  }

  public async uploadImages(files: Express.Multer.File[]) {
    const uploadImages = await this.uploadRepo.uploadImages(files);
    return uploadImages;
  }
}
