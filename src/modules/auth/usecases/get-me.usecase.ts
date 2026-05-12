import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IUserRepository } from '../repositories/iuser.repository';
import { UserModel } from '../infra/models/user.model';

@Injectable()
export class GetMeUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  /**
   * Retrieves the current user's profile.
   * Ensures sensitive data like password_hash and tokens are removed.
   * @param userId The ID of the authenticated user.
   * @returns The user profile data.
   */
  async execute(userId: string): Promise<Partial<UserModel>> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const userJson = user.toJSON();

    // Explicitly remove sensitive fields
    delete userJson.password_hash;
    delete userJson.refresh_token;
    delete userJson.recovery_token;
    delete userJson.recovery_token_expires_at;

    return userJson;
  }
}
