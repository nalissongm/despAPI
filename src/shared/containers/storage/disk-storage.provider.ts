import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { IStorageProvider } from './istorage.provider';

@Injectable()
export class DiskStorageProvider implements IStorageProvider {
  private readonly uploadsPath = path.resolve(__dirname, '..', '..', '..', '..', 'uploads');

  async saveFile(file: string, folder: string): Promise<string> {
    const tempPath = path.resolve(__dirname, '..', '..', '..', '..', 'tmp', 'uploads', file);
    const finalPath = path.resolve(this.uploadsPath, folder, file);

    const folderPath = path.resolve(this.uploadsPath, folder);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    await fs.promises.rename(tempPath, finalPath);

    return file;
  }

  async deleteFile(file: string, folder: string): Promise<void> {
    const filePath = path.resolve(this.uploadsPath, folder, file);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}
