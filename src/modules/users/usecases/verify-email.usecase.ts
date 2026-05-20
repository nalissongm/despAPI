import { Injectable, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { VerifyEmailDto } from '../dtos/verify-email.dto';
import { IUserRepository } from '../../auth/repositories/iuser.repository';

@Injectable()
export class VerifyEmailUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string, data: VerifyEmailDto): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (user.recoveryToken !== data.code) {
      throw new BadRequestException('Invalid verification code.');
    }

    user.isEmailVerified = true;
    user.onboardingStep = 'PENDING_PROFILE';
    user.recoveryToken = null;
    
    await user.save();
  }
}
