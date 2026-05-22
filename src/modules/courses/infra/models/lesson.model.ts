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
import { CourseModuleModel } from './course-module.model';

@Table({
  tableName: 'lessons',
  timestamps: true,
  underscored: true,
})
export class LessonModel extends Model<LessonModel> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => CourseModuleModel)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    field: 'module_id',
  })
  moduleId: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  title: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  description: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM('video', 'text'),
    field: 'content_type',
  })
  contentType: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(255),
    field: 'video_url',
  })
  videoUrl: string;

  @AllowNull(true)
  @Column({
    type: DataType.INTEGER,
    field: 'duration_seconds',
  })
  durationSeconds: number;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    field: 'order_index',
  })
  orderIndex: number;

  @BelongsTo(() => CourseModuleModel)
  module: CourseModuleModel;
}
