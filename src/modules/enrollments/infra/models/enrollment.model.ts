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
  CreatedAt,
} from 'sequelize-typescript';
import { UserModel } from '../../../auth/infra/models/user.model';
import { CourseModel } from '../../../courses/infra/models/course.model';
import { EnrollmentStatus } from '../../dtos/create-enrollment.dto';

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
  @Default(EnrollmentStatus.ACTIVE)
  @Column(DataType.ENUM(...Object.values(EnrollmentStatus)))
  status: EnrollmentStatus;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'enrolled_at',
  })
  enrolledAt: Date;

  @BelongsTo(() => UserModel)
  user: UserModel;

  @BelongsTo(() => CourseModel)
  course: CourseModel;
}
