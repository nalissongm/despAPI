import { Module } from '@nestjs/common';
import { RoleModel } from './infra/models/role.model';
import { UserRoleModel } from './infra/models/user-role.model';

@Module({
  providers: [
    {
      provide: 'ROLE_REPOSITORY',
      useValue: RoleModel,
    },
    {
      provide: 'USER_ROLE_REPOSITORY',
      useValue: UserRoleModel,
    },
  ],
  exports: ['ROLE_REPOSITORY', 'USER_ROLE_REPOSITORY'],
})
export class RolesModule {}
