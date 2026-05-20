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
  @Column(DataType.UUID)
  user_id: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  bio: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  specialty: string;

  @AllowNull(true)
  @Column(DataType.JSONB)
  social_links: any;

  @AllowNull(true)
  @Column(DataType.STRING(6))
  crm: string;

  @AllowNull(true)
  @Column(DataType.STRING(2))
  crm_uf: string;

  @BelongsTo(() => UserModel)
  user: UserModel;

  @HasMany(() => CourseModel)
  courses: CourseModel[];
}
