import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from '../repositories/iuser.repository';
import { IHashProvider } from '../../../shared/containers/hash/ihash.provider';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IHashProvider)
    private readonly hashProvider: IHashProvider,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Validates the refresh token and issues a new pair of tokens (Rotation).
   * @param userId The user ID from the refresh token payload.
   * @param refreshToken The raw refresh token from the request.
   * @returns A new pair of access and refresh tokens.
   */
  async execute(userId: string, refreshToken: string): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.userRepository.findById(userId);

    if (!user || !user.refresh_token) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    // Verify if the provided refresh token matches the hashed one in the database
    const isTokenValid = await this.hashProvider.compareHash(
      refreshToken,
      user.refresh_token,
    );

    if (!isTokenValid) {
      // Security: If the token is invalid but exists in DB (not null), 
      // it might be a reuse attempt. We clear it for safety.
      user.refresh_token = null;
      await this.userRepository.save(user);
      throw new UnauthorizedException('Token reuse detected. Please login again.');
    }

    // Generate new payload
    const payload = { sub: user.id, email: user.email, role: user.role };

    const newAccessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '15m',
    });

    const newRefreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    // Replace the old refresh token with the new hashed one (Rotation)
    user.refresh_token = await this.hashProvider.generateHash(newRefreshToken);
    await this.userRepository.save(user);

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  }
}
