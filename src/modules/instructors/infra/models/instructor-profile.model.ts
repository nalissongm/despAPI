import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
  AllowNull,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { UserModel } from '../../../auth/infra/models/user.model';
import { CourseModel } from '../../../courses/infra/models/course.model';

@Table({
  tableName: 'instructor_profiles',
  timestamps: true,
  underscored: true,
})
export class InstructorProfileModel extends Model<InstructorProfileModel> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => UserModel)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    field: 'user_id',
  })
  userId: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  bio: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  specialty: string;

  @AllowNull(true)
  @Column({
    type: DataType.JSONB,
    field: 'social_links',
  })
  socialLinks: any;

  @AllowNull(true)
  @Column(DataType.STRING(6))
  crm: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(2),
    field: 'crm_uf',
  })
  crmUf: string;

  @BelongsTo(() => UserModel)
  user: UserModel;

  @HasMany(() => CourseModel)
  courses: CourseModel[];
}
