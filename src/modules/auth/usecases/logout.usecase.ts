// src/modules/auth/usecases/logout.usecase.ts

import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../repositories/iuser.repository';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  /**
   * Executes the logout flow.
   * 1. Clears the refresh token from the database.
   * 2. (Optional) Could add the access token to a blocklist if implemented.
   * @param userId The ID of the user logging out.
   */
  async execute(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    
    if (user) {
      user.refresh_token = null;
      await this.userRepository.save(user);
    }
  }
}
