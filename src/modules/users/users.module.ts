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
import { CreateStudentUseCase } from './usecases/create-student.usecase';
import { UpdateUserAvatarUseCase } from './usecases/update-user-avatar.usecase';
import { AuthModule } from '../auth/auth.module';
import { UserModel } from '../auth/infra/models/user.model';
import { RoleModel } from '../roles/infra/models/role.model';
import { UserRoleModel } from '../roles/infra/models/user-role.model';
import { IStorageProvider } from '../../shared/containers/storage/istorage.provider';
import { DiskStorageProvider } from '../../shared/containers/storage/disk-storage.provider';

@Module({
  imports: [
    SequelizeModule.forFeature([UserModel, RoleModel, UserRoleModel]),
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
    CreateStudentUseCase,
    UpdateUserAvatarUseCase,

    {
      provide: IStorageProvider,
      useClass: DiskStorageProvider,
    },

    // Provide the expected tokens for UseCases that use @Inject('MODEL_NAME')
    {
      provide: 'USER_MODEL',
      useValue: UserModel,
    },
    {
      provide: 'ROLE_MODEL',
      useValue: RoleModel,
    },
    {
      provide: 'USER_ROLE_MODEL',
      useValue: UserRoleModel,
    },
  ],
})
export class UsersModule {}
