import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
  AllowNull,
} from 'sequelize-typescript';
import { UserRole } from './enums/user-role.enum';

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true,
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
  @Column({
    type: DataType.STRING,
    field: 'password_hash',
  })
  passwordHash: string;

  @AllowNull(false)
  @Default(UserRole.STUDENT)
  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
  })
  role: UserRole;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    field: 'registration_number',
  })
  registrationNumber: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    field: 'full_name',
  })
  fullName: string;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
    field: 'date_of_birth',
  })
  dateOfBirth: Date;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(11),
    unique: true,
    field: 'cpf',
  })
  cpf: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    field: 'avatar_url',
  })
  avatarUrl: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    field: 'refresh_token',
  })
  refreshToken: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    field: 'recovery_token',
  })
  recoveryToken: string;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
    field: 'recovery_token_expires_at',
  })
  recoveryTokenExpiresAt: Date;
}
