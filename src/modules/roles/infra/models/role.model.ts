import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
  AllowNull,
  BelongsToMany,
} from 'sequelize-typescript';
import { UserModel } from '../../../auth/infra/models/user.model';
import { UserRoleModel } from './user-role.model';

@Table({
  tableName: 'roles',
  timestamps: true,
  underscored: true,
})
export class RoleModel extends Model<RoleModel> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    unique: true,
  })
  name: string;

  @BelongsToMany(() => UserModel, () => UserRoleModel)
  users: UserModel[];
}
