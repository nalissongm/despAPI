import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoleModel } from './infra/models/role.model';
import { UserRoleModel } from './infra/models/user-role.model';
import { RolesController } from './infra/controllers/roles.controller';
import { CreateRoleUseCase } from './usecases/create-role.usecase';
import { FindAllRolesUseCase } from './usecases/find-all-roles.usecase';
import { DeleteRoleUseCase } from './usecases/delete-role.usecase';
import { AssignRoleToUserUseCase } from './usecases/assign-role-to-user.usecase';
import { UserModel } from '../auth/infra/models/user.model';

@Module({
  imports: [
    SequelizeModule.forFeature([RoleModel, UserRoleModel, UserModel]),
  ],
  controllers: [RolesController],
  providers: [
    CreateRoleUseCase,
    FindAllRolesUseCase,
    DeleteRoleUseCase,
    AssignRoleToUserUseCase,
  ],
  exports: [AssignRoleToUserUseCase],
})
export class RolesModule {}
