import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { LessonModel } from '../../../courses/infra/models/lesson.model';
import { FileModel } from './file.model';

@Table({
  tableName: 'lesson_files',
  timestamps: true,
  underscored: true,
})
export class LessonFileModel extends Model<LessonFileModel> {
  @ForeignKey(() => LessonModel)
  @Column(DataType.UUID)
  lesson_id: string;

  @ForeignKey(() => FileModel)
  @Column(DataType.UUID)
  file_id: string;
}
