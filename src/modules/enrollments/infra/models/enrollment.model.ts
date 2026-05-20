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
  @Column({
    type: DataType.UUID,
    field: 'user_id',
  })
  userId: string;

  @ForeignKey(() => CourseModel)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    field: 'course_id',
  })
  courseId: string;

  @AllowNull(false)
  @Default('active')
  @Column(DataType.ENUM('active', 'expired', 'cancelled'))
  status: string;

  @AllowNull(false)
  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    field: 'enrolled_at',
  })
  enrolledAt: Date;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
    field: 'expires_at',
  })
  expiresAt: Date;

  @BelongsTo(() => UserModel)
  user: UserModel;

  @BelongsTo(() => CourseModel)
  course: CourseModel;
}
