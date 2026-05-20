import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
  AllowNull,
  BelongsToMany,
} from 'sequelize-typescript';
import { LessonModel } from '../../../courses/infra/models/lesson.model';
import { LessonFileModel } from './lesson-file.model';

@Table({
  tableName: 'files',
  timestamps: true,
  underscored: true,
})
export class FileModel extends Model<FileModel> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  title: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  description: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  file_url: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  file_type: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  file_size: number;

  @BelongsToMany(() => LessonModel, () => LessonFileModel)
  lessons: LessonModel[];
}
