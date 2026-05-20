import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { UserModel } from '../../../auth/infra/models/user.model';
import { RoleModel } from './role.model';

@Table({
  tableName: 'user_roles',
  timestamps: true,
  underscored: true,
})
export class UserRoleModel extends Model<UserRoleModel> {
  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.UUID,
    field: 'user_id',
  })
  userId: string;

  @ForeignKey(() => RoleModel)
  @Column({
    type: DataType.UUID,
    field: 'role_id',
  })
  roleId: string;
}
