import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RoleModel } from '../infra/models/role.model';

@Injectable()
export class FindAllRolesUseCase {
  constructor(
    @InjectModel(RoleModel)
    private readonly roleModel: typeof RoleModel,
  ) {}

  async execute(): Promise<RoleModel[]> {
    return this.roleModel.findAll();
  }
}
