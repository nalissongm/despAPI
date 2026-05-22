import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { IUserRepository } from '../../auth/repositories/iuser.repository';
import { IStorageProvider } from '../../../shared/containers/storage/istorage.provider';
import { UserModel } from '../../auth/infra/models/user.model';

@Injectable()
export class UpdateUserAvatarUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IStorageProvider)
    private readonly storageProvider: IStorageProvider,
  ) {}

  async execute(userId: string, avatarFilename: string): Promise<UserModel> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      // If user not found, we MUST delete the temporary file
      const tempPath = path.resolve(__dirname, '..', '..', '..', '..', 'tmp', 'uploads', avatarFilename);
      if (fs.existsSync(tempPath)) {
        await fs.promises.unlink(tempPath);
      }
      throw new NotFoundException('Only authenticated users can change avatar.');
    }

    try {
      if (user.avatarUrl) {
        // Delete old avatar if it exists
        await this.storageProvider.deleteFile(user.avatarUrl, 'avatars');
      }

      // Save new avatar to final destination
      const filename = await this.storageProvider.saveFile(avatarFilename, 'avatars');

      user.avatarUrl = filename;

      await this.userRepository.save(user);

      return user;
    } catch (err) {
      // If something goes wrong during storage or database update, 
      // we MUST ensure the temp file is cleaned up if it hasn't been moved yet.
      // Note: DiskStorageProvider.saveFile uses rename (move), so it might already be gone from temp.
      const tempPath = path.resolve(__dirname, '..', '..', '..', '..', 'tmp', 'uploads', avatarFilename);
      if (fs.existsSync(tempPath)) {
        await fs.promises.unlink(tempPath);
      }
      throw err;
    }
  }
}
