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
import { CourseModel } from './course.model';
import { LessonModel } from './lesson.model';

@Table({
  tableName: 'course_modules',
  timestamps: true,
  underscored: true,
})
export class CourseModuleModel extends Model<CourseModuleModel> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => CourseModel)
  @AllowNull(false)
  @Column(DataType.UUID)
  course_id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  title: string;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  order_index: number;

  @BelongsTo(() => CourseModel)
  course: CourseModel;

  @HasMany(() => LessonModel)
  lessons: LessonModel[];
}
