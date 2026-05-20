import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthController } from './infra/controllers/auth.controller';

// Use Cases
import { LoginUseCase } from './usecases/login.usecase';
import { RefreshTokenUseCase } from './usecases/refresh-token.usecase';
import { RecoverPasswordUseCase } from './usecases/recover-password.usecase';
import { ResetPasswordUseCase } from './usecases/reset-password.usecase';
import { LogoutUseCase } from './usecases/logout.usecase';
import { GetMeUseCase } from './usecases/get-me.usecase';

// Repositories
import { IUserRepository } from './repositories/iuser.repository';
import { SequelizeUserRepository } from './repositories/sequelize.user.repository';

// Hash Provider
import { IHashProvider } from '../../shared/containers/hash/ihash.provider';
import { BcryptHashProvider } from '../../shared/containers/hash/bcrypt.hash.provider';

// Mail Provider
import { IMailProvider } from '../../shared/containers/mail/imail.provider';
import { SMTPMailProvider } from '../../shared/containers/mail/smtp.mail.privider';

// Models
import { UserModel } from './infra/models/user.model';

// JWT Strategy
import { JwtStrategy } from './infra/strategies/jwt.strategy';
import { JwtRefreshStrategy } from './infra/strategies/jwt-refresh.strategy';

// Guards
import { RolesGuard } from './infra/http/guards/roles.guard';
import { PermissionsGuard } from './infra/http/guards/permissions.guard';

import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'yourSecretKey',
        signOptions: { expiresIn: '1h' },
      }),
    }),
    SequelizeModule.forFeature([UserModel]),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    RefreshTokenUseCase,
    RecoverPasswordUseCase,
    ResetPasswordUseCase,
    LogoutUseCase,
    GetMeUseCase,

    JwtStrategy,
    JwtRefreshStrategy,

    RolesGuard,
    PermissionsGuard,

    {
      provide: IUserRepository,
      useClass: SequelizeUserRepository,
    },
    {
      provide: IHashProvider,
      useClass: BcryptHashProvider,
    },
    {
      provide: IMailProvider,
      useClass: SMTPMailProvider,
    },
    {
      provide: 'USER_MODEL',
      useValue: UserModel,
    },
  ],
  exports: [IUserRepository, IHashProvider, IMailProvider, SequelizeModule],
})
export class AuthModule {}
