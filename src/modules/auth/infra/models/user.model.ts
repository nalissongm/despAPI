// src/modules/auth/infra/models/user.model.ts

import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
  AllowNull,
} from 'sequelize-typescript';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class UserModel extends Model<UserModel> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    unique: true,
  })
  email: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  password_hash: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  recovery_token: string;
}
