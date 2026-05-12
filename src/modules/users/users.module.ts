import { Module } from '@nestjs/common';
import { UsersController } from './infra/controllers/users.controller';
import { CreateUserUseCase } from './usecases/create-user.usecase';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule], // Import AuthModule to get access to IUserRepository and IHashProvider
  controllers: [UsersController],
  providers: [CreateUserUseCase],
})
export class UsersModule {}
