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
  BelongsToMany,
} from 'sequelize-typescript';
import { CourseModuleModel } from './course-module.model';
import { UserLessonProgressModel } from '../../../progress/infra/models/user-lesson-progress.model';
import { FileModel } from '../../../files/infra/models/file.model';
import { LessonFileModel } from '../../../files/infra/models/lesson-file.model';

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
  @Column(DataType.UUID)
  module_id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  title: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  description: string;

  @AllowNull(false)
  @Column(DataType.ENUM('video', 'article'))
  content_type: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  mux_asset_id: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  mux_playback_id: string;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  duration_seconds: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  order_index: number;

  @BelongsTo(() => CourseModuleModel)
  module: CourseModuleModel;

  @HasMany(() => UserLessonProgressModel)
  progress: UserLessonProgressModel[];

  @BelongsToMany(() => FileModel, () => LessonFileModel)
  files: FileModel[];
}
