import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { IUserRepository } from '../repositories/iuser.repository';
import { IHashProvider } from '../../../shared/containers/hash/ihash.provider';
import { ResetPasswordDto } from '../dtos/reset-password.dto';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IHashProvider)
    private readonly hashProvider: IHashProvider,
  ) {}

  /**
   * Resets the user's password using a recovery token.
   * 1. Validates the token existence and expiration.
   * 2. Hashes the new password.
   * 3. Updates the user record and clears recovery fields.
   * @param resetPasswordDto The token and new password.
   */
  async execute(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const user = await this.userRepository.findByRecoveryToken(resetPasswordDto.token);

    if (!user) {
      throw new BadRequestException('Invalid or expired recovery token.');
    }

    const now = new Date();
    if (user.recoveryTokenExpiresAt && user.recoveryTokenExpiresAt < now) {
      throw new BadRequestException('Recovery token has expired.');
    }

    user.passwordHash = await this.hashProvider.generateHash(resetPasswordDto.newPassword);
    user.recoveryToken = null;
    user.recoveryTokenExpiresAt = null;
    
    await this.userRepository.save(user);
  }
}

