// src/modules/auth/usecases/recover-password.usecase.ts

import { Injectable, Inject } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { IUserRepository } from '../repositories/iuser.repository';
import { IMailProvider } from '../../../shared/containers/mail/imail.provider';

@Injectable()
export class RecoverPasswordUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IMailProvider)
    private readonly mailProvider: IMailProvider,
  ) {}

  /**
   * Executes the password recovery flow.
   * 1. Finds the user by email.
   * 2. Generates a secure random token.
   * 3. Saves the token to the user record.
   * 4. Sends a recovery email.
   * @param email The user's email address.
   */
  async execute(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      // We don't want to reveal if a user exists or not for security reasons.
      // So we just return without throwing an error.
      // In a real app, you might log this attempt.
      return;
    }

    const recoveryToken = randomBytes(32).toString('hex');
    user.recovery_token = recoveryToken;
    await this.userRepository.save(user);

    await this.mailProvider.sendMail({
      to: user.email,
      subject: 'Password Recovery',
      body: `You requested a password recovery. Please use the following token to reset your password: ${recoveryToken}`,
    });
  }
}
