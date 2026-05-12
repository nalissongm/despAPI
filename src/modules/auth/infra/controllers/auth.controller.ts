// src/modules/auth/infra/controllers/auth.controller.ts

import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { LoginUseCase } from '../../usecases/login.usecase';
import { RecoverPasswordUseCase } from '../../usecases/recover-password.usecase';
import { LogoutUseCase } from '../../usecases/logout.usecase';
import { LoginDto } from '../../dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly recoverPasswordUseCase: RecoverPasswordUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  /**
   * Handles user login.
   * @param loginDto - The user's credentials.
   * @returns A JWT access token.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.loginUseCase.execute(loginDto);
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
   * Handles user logout.
   * Requires a valid JWT to identify which token to invalidate.
   * @param req - The incoming request object.
   */
  @Post('logout')
  @UseGuards(AuthGuard('jwt')) // Assuming you have a jwt strategy configured
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Req() req: Request) {
    // The token is typically extracted from the Authorization header.
    // The AuthGuard will place the user payload on the request, but for logout,
    // we need the raw token itself.
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      this.logoutUseCase.execute(token);
    }
  }
}
