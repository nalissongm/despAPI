// src/modules/auth/infra/strategies/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IUserRepository } from '../../repositories/iuser.repository';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'yourSecretKey',
    });
  }

  /**
   * Validates the JWT payload.
   * This method is called by Passport after it verifies the JWT's signature and expiration.
   * It finds the user in the database and attaches them to the request object.
   * @param payload The decoded JWT payload.
   * @returns The user object.
   */
  async validate(payload: { sub: string; email: string }) {
    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    // The return value is attached to the request as `req.user`
    return { id: user.id, email: user.email };
  }
}
