// src/modules/auth/infra/controllers/auth.controller.ts

import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { LoginUseCase } from '../../usecases/login.usecase';
import { RefreshTokenUseCase } from '../../usecases/refresh-token.usecase';
import { RecoverPasswordUseCase } from '../../usecases/recover-password.usecase';
import { LogoutUseCase } from '../../usecases/logout.usecase';
import { LoginDto } from '../../dtos/login.dto';
import { ResetPasswordDto } from '../../dtos/reset-password.dto';
import { ResetPasswordUseCase } from '../../usecases/reset-password.usecase';
import { GetMeUseCase } from '../../usecases/get-me.usecase';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly recoverPasswordUseCase: RecoverPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly getMeUseCase: GetMeUseCase,
  ) {}

  /**
   * Handles user login.
   * @param loginDto - The user's credentials.
   * @returns A pair of access and refresh tokens.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.loginUseCase.execute(loginDto);
  }

  /**
   * Handles token refresh.
   * Requires a valid refresh token.
   * @param req - The incoming request object.
   * @returns A new pair of access and refresh tokens.
   */
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request) {
    const { sub, refreshToken } = req.user as any;
    return this.refreshTokenUseCase.execute(sub, refreshToken);
  }

  /**
   * Handles password recovery request.
   * @param body - Object containing the user's email.
   */
  @Post('recover-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async recoverPassword(@Body('email') email: string) {
    await this.recoverPasswordUseCase.execute(email);
  }

  /**
   * Handles password reset.
   * @param resetPasswordDto - The token and new password.
   */
  @Post('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.resetPasswordUseCase.execute(resetPasswordDto);
  }

  /**
   * Handles user logout.
   * Requires a valid JWT to identify the user.
   * @param req - The incoming request object.
   */
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request) {
    const user = req.user as any;
    await this.logoutUseCase.execute(user.id);
  }

  /**
   * Retrieves the current authenticated user's profile.
   * @param req - The incoming request object.
   * @returns The user profile.
   */
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async getMe(@Req() req: Request) {
    const user = req.user as any;
    return this.getMeUseCase.execute(user.id);
  }
}
