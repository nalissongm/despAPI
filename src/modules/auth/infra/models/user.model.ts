import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
  AllowNull,
  BelongsToMany,
  HasOne,
  HasMany,
} from 'sequelize-typescript';
import { RoleModel } from '../../../roles/infra/models/role.model';
import { UserRoleModel } from '../../../roles/infra/models/user-role.model';
import { InstructorProfileModel } from '../../../instructors/infra/models/instructor-profile.model';
import { EnrollmentModel } from '../../../enrollments/infra/models/enrollment.model';

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

  @AllowNull(true)
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

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    unique: true,
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

  @AllowNull(false)
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    field: 'is_email_verified',
  })
  isEmailVerified: boolean;

  @AllowNull(false)
  @Default('COMPLETED')
  @Column({
    type: DataType.STRING,
    field: 'onboarding_step',
  })
  onboardingStep: string;

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

  @BelongsToMany(() => RoleModel, () => UserRoleModel)
  roles: RoleModel[];

  @HasOne(() => InstructorProfileModel)
  instructorProfile: InstructorProfileModel;

  @HasMany(() => EnrollmentModel)
  enrollments: EnrollmentModel[];
}
