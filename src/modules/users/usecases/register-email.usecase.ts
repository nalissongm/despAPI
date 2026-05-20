import { Injectable, ConflictException, NotFoundException, Inject } from '@nestjs/common';
import { RegisterEmailDto } from '../dtos/register-email.dto';
import { IUserRepository } from '../../auth/repositories/iuser.repository';
import { IMailProvider } from '../../../shared/containers/mail/imail.provider';

@Injectable()
export class RegisterEmailUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IMailProvider)
    private readonly mailProvider: IMailProvider,
  ) {}

  async execute(userId: string, data: RegisterEmailDto): Promise<void> {
    const { email } = data;

    const emailInUse = await this.userRepository.findByEmail(email);
    if (emailInUse && emailInUse.id !== userId) {
      throw new ConflictException('Email already in use.');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    user.email = email;
    user.recoveryToken = otp; // Reusing recovery_token field for OTP temporarily
    user.isEmailVerified = false;
    
    await user.save();

    await this.mailProvider.sendMail({
      to: email,
      subject: 'Verification Code',
      body: `Your verification code is: ${otp}`,
    });
  }
}
