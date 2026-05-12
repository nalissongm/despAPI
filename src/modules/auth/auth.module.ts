// src/modules/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './infra/controllers/auth.controller';

// Use Cases
import { LoginUseCase } from './usecases/login.usecase';
import { RecoverPasswordUseCase } from './usecases/recover-password.usecase';
import { LogoutUseCase } from './usecases/logout.usecase';

// Repositories
import { IUserRepository } from './repositories/iuser.repository';
import { SequelizeUserRepository } from './repositories/sequelize.user.repository';

// Hash Provider
import { IHashProvider } from '../../shared/containers/hash/ihash.provider';
import { BcryptHashProvider } from '../../shared/containers/hash/bcrypt.hash.provider';

// Mail Provider
import { IMailProvider } from '../../shared/containers/mail/imail.provider';
import { DummyMailProvider } from '../../shared/containers/mail/dummy.mail.provider';

// Models
import { UserModel } from './infra/models/user.model';

// JWT Strategy
import { JwtStrategy } from './infra/strategies/jwt.strategy';

import { ConfigService } from '@nestjs/config';
import { SMTPMailProvider } from 'src/shared/containers/mail/smtp.mail.privider';

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
  ],
  controllers: [AuthController],
  providers: [
    // Use Cases
    LoginUseCase,
    RecoverPasswordUseCase,
    LogoutUseCase,

    // JWT Strategy
    JwtStrategy,

    // Custom Providers for DI
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
  exports: [IUserRepository, IHashProvider], // Export if other modules need them
})
export class AuthModule {}
