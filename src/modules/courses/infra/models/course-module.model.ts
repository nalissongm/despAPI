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
  @Column({
    type: DataType.UUID,
    field: 'course_id',
  })
  courseId: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  title: string;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    field: 'order_index',
  })
  orderIndex: number;

  @BelongsTo(() => CourseModel)
  course: CourseModel;

  @HasMany(() => LessonModel)
  lessons: LessonModel[];
}
