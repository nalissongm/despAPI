import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersController } from './infra/controllers/users.controller';
import { CreateUserUseCase } from './usecases/create-user.usecase';
import { UpdateUserUseCase } from './usecases/update-user.usecase';
import { DeleteUserUseCase } from './usecases/delete-user.usecase';
import { FindUserByIdUseCase } from './usecases/find-user-by-id.usecase';
import { RegisterEmailUseCase } from './usecases/register-email.usecase';
import { VerifyEmailUseCase } from './usecases/verify-email.usecase';
import { CompleteProfileUseCase } from './usecases/complete-profile.usecase';
import { AuthModule } from '../auth/auth.module';
import { UserModel } from '../auth/infra/models/user.model';

@Module({
  imports: [
    SequelizeModule.forFeature([UserModel]),
    AuthModule,
  ],
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    FindUserByIdUseCase,
    RegisterEmailUseCase,
    VerifyEmailUseCase,
    CompleteProfileUseCase,
  ],
})
export class UsersModule {}
