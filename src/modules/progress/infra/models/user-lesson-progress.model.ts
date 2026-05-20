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
import { LessonModel } from '../../../courses/infra/models/lesson.model';

@Table({
  tableName: 'user_lesson_progress',
  timestamps: true,
  underscored: true,
})
export class UserLessonProgressModel extends Model<UserLessonProgressModel> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => UserModel)
  @AllowNull(false)
  @Column(DataType.UUID)
  user_id: string;

  @ForeignKey(() => LessonModel)
  @AllowNull(false)
  @Column(DataType.UUID)
  lesson_id: string;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  last_watched_seconds: number;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  is_completed: boolean;

  @AllowNull(true)
  @Column(DataType.DATE)
  completed_at: Date;

  @BelongsTo(() => UserModel)
  user: UserModel;

  @BelongsTo(() => LessonModel)
  lesson: LessonModel;
}
