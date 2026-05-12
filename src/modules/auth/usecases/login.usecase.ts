// src/modules/auth/usecases/login.usecase.ts

import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from '../repositories/iuser.repository';
import { IHashProvider } from '../../../shared/containers/hash/ihash.provider';
import { LoginDto } from '../dtos/login.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IHashProvider)
    private readonly hashProvider: IHashProvider,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Executes the login flow.
   * 1. Validates user existence.
   * 2. Compares password hash.
   * 3. Generates and returns a JWT.
   * @param loginDto The login credentials.
   * @returns An object containing the access token.
   */
  async execute(loginDto: LoginDto): Promise<{ access_token: string }> {
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

    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
    };
  }
}
