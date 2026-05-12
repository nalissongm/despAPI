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
  BelongsToMany,
} from 'sequelize-typescript';
import { CourseModel } from '../../../courses/infra/models/course.model';
import { UserModel } from '../../../auth/infra/models/user.model';
import { UserContentModel } from './user-content.model';

@Table({
  tableName: 'contents',
  timestamps: true,
})
export class ContentModel extends Model<ContentModel> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  title: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  body: string;

  @ForeignKey(() => CourseModel)
  @Column(DataType.UUID)
  course_id: string;

  @BelongsTo(() => CourseModel)
  course: CourseModel;

  @BelongsToMany(() => UserModel, () => UserContentModel)
  students: UserModel[];
}
