import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';
import { UserModel } from '../../../auth/infra/models/user.model';
import { CourseModel } from './course.model';

@Table({
  tableName: 'user_courses',
  timestamps: true,
})
export class UserCourseModel extends Model<UserCourseModel> {
  @ForeignKey(() => UserModel)
  @Column(DataType.UUID)
  user_id: string;

  @ForeignKey(() => CourseModel)
  @Column(DataType.UUID)
  course_id: string;
}
