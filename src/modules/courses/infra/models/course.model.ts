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
import { CourseModuleModel } from './course-module.model';
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
  @Column(DataType.UUID)
  instructor_id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  title: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  description: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  image_cover_url: string;

  @BelongsTo(() => InstructorProfileModel)
  instructor: InstructorProfileModel;

  @HasMany(() => CourseModuleModel)
  modules: CourseModuleModel[];

  @HasMany(() => EnrollmentModel)
  enrollments: EnrollmentModel[];
}
