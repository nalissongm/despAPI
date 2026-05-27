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
import { InstructorProfileModel } from '../../../instructors/infra/models/instructor-profile.model';
import { EnrollmentModel } from '../../../enrollments/infra/models/enrollment.model';

@Table({
  tableName: 'courses',
  timestamps: true,
  underscored: true,
})
export class CourseModel extends Model<CourseModel> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => InstructorProfileModel)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    field: 'instructor_id',
  })
  instructorId: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  title: string;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  description: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(255),
    field: 'image_course_url',
  })
  imageCourseUrl: string;

  @BelongsTo(() => InstructorProfileModel)
  instructor: InstructorProfileModel;

  @HasMany(() => EnrollmentModel)
  enrollments: EnrollmentModel[];
}
