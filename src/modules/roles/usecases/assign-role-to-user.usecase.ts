import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserRoleModel } from '../infra/models/user-role.model';
import { UserModel } from '../../auth/infra/models/user.model';
import { RoleModel } from '../infra/models/role.model';

@Injectable()
export class AssignRoleToUserUseCase {
  constructor(
    @InjectModel(UserRoleModel)
    private readonly userRoleModel: typeof UserRoleModel,
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
    @InjectModel(RoleModel)
    private readonly roleModel: typeof RoleModel,
  ) {}

  async execute(userId: string, roleName: string): Promise<void> {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const role = await this.roleModel.findOne({ where: { name: roleName } });
    if (!role) {
      throw new NotFoundException('Role not found.');
    }

    await this.userRoleModel.findOrCreate({
      where: { userId, roleId: role.id },
    });
  }
}
