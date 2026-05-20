import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Op } from 'sequelize';
import { LoginDto } from '../dtos/login.dto';
import { IUserRepository } from '../repositories/iuser.repository';
import { IHashProvider } from '../../../shared/containers/hash/ihash.provider';
import { UserModel } from '../infra/models/user.model';
import { RoleModel } from '../../roles/infra/models/role.model';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IHashProvider)
    private readonly hashProvider: IHashProvider,
    @Inject('USER_MODEL')
    private readonly userModel: typeof UserModel,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(loginDto: LoginDto): Promise<{ 
    access_token: string; 
    refresh_token: string; 
    onboarding_step: string;
    requires_onboarding: boolean;
    user: { id: string; email: string; roles: string[] };
  }> {
    const { identifier, password } = loginDto;

    // Dual login strategy: Search by email OR registration number
    const user = await this.userModel.findOne({
      where: {
        [Op.or]: [
          { email: identifier },
          { registrationNumber: identifier },
        ],
      },
      include: [RoleModel],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordValid = await this.hashProvider.compareHash(
      password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const roleNames = user.roles ? user.roles.map(r => r.name) : [];

    const payload = { sub: user.id, email: user.email, roles: roleNames };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    user.refreshToken = await this.hashProvider.generateHash(refreshToken);
    await user.save();

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      onboarding_step: user.onboardingStep,
      requires_onboarding: user.onboardingStep !== 'COMPLETED',
      user: {
        id: user.id,
        email: user.email,
        roles: roleNames,
      },
    };
  }
}
