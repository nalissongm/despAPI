// src/modules/auth/usecases/login.usecase.ts

import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from '../repositories/iuser.repository';
import { IHashProvider } from '../../../shared/containers/hash/ihash.provider';
import { LoginDto } from '../dtos/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IHashProvider)
    private readonly hashProvider: IHashProvider,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Executes the login flow.
   * 1. Validates user existence.
   * 2. Compares password hash.
   * 3. Generates Access Token (short-lived) and Refresh Token (long-lived).
   * 4. Hashes and stores the Refresh Token in the database.
   * @param loginDto The login credentials.
   * @returns An object containing the access and refresh tokens.
   */
  async execute(loginDto: LoginDto): Promise<{ access_token: string; refresh_token: string; user: { id: string; email: string; role: string } }> {
    const user = await this.userRepository.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordValid = await this.hashProvider.compareHash(
      loginDto.password,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    // Hash the refresh token before storing it for security (Rotation & Revocation support)
    user.refresh_token = await this.hashProvider.generateHash(refreshToken);
    await this.userRepository.save(user);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
