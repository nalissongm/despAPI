import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RoleModel } from '../infra/models/role.model';

@Injectable()
export class DeleteRoleUseCase {
  constructor(
    @InjectModel(RoleModel)
    private readonly roleModel: typeof RoleModel,
  ) {}

  async execute(id: string): Promise<void> {
    const role = await this.roleModel.findByPk(id);

    if (!role) {
      throw new NotFoundException('Role not found.');
    }

    await role.destroy();
  }
}
