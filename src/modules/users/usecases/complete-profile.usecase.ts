import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CompleteProfileDto } from '../dtos/complete-profile.dto';
import { IUserRepository } from '../../auth/repositories/iuser.repository';

@Injectable()
export class CompleteProfileUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string, data: CompleteProfileDto): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    user.cpf = data.cpf;
    user.dateOfBirth = new Date(data.dateOfBirth);
    if (data.avatarUrl) {
      user.avatarUrl = data.avatarUrl;
    }
    
    user.onboardingStep = 'COMPLETED';
    
    await user.save();
  }
}
