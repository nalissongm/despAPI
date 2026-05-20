import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RoleModel } from '../infra/models/role.model';
import { CreateRoleDto } from '../dtos/create-role.dto';

@Injectable()
export class CreateRoleUseCase {
  constructor(
    @InjectModel(RoleModel)
    private readonly roleModel: typeof RoleModel,
  ) {}

  async execute(data: CreateRoleDto): Promise<RoleModel> {
    const roleExists = await this.roleModel.findOne({ where: { name: data.name } });

    if (roleExists) {
      throw new ConflictException('Role already exists');
    }

    return this.roleModel.create(data as any);
  }
}
