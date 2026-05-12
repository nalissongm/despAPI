import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
  AllowNull,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { ContentModel } from '../../../content/infra/models/content.model';
import { UserModel } from '../../../auth/infra/models/user.model';
import { UserCourseModel } from './user-course.model';

@Table({
  tableName: 'courses',
  timestamps: true,
})
export class CourseModel extends Model<CourseModel> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  description: string;

  @HasMany(() => ContentModel)
  contents: ContentModel[];

  @BelongsToMany(() => UserModel, () => UserCourseModel)
  teachers: UserModel[];
}
