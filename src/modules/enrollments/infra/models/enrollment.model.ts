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
} from 'sequelize-typescript';
import { UserModel } from '../../../auth/infra/models/user.model';
import { CourseModel } from '../../../courses/infra/models/course.model';

@Table({
  tableName: 'enrollments',
  timestamps: true,
  underscored: true,
})
export class EnrollmentModel extends Model<EnrollmentModel> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => UserModel)
  @AllowNull(false)
  @Column(DataType.UUID)
  user_id: string;

  @ForeignKey(() => CourseModel)
  @AllowNull(false)
  @Column(DataType.UUID)
  course_id: string;

  @AllowNull(false)
  @Default('active')
  @Column(DataType.ENUM('active', 'expired', 'cancelled'))
  status: string;

  @AllowNull(false)
  @Default(DataType.NOW)
  @Column(DataType.DATE)
  enrolled_at: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
  expires_at: Date;

  @BelongsTo(() => UserModel)
  user: UserModel;

  @BelongsTo(() => CourseModel)
  course: CourseModel;
}
