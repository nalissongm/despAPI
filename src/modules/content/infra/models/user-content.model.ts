import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';
import { UserModel } from '../../../auth/infra/models/user.model';
import { ContentModel } from './content.model';

@Table({
  tableName: 'user_contents',
  timestamps: true,
})
export class UserContentModel extends Model<UserContentModel> {
  @ForeignKey(() => UserModel)
  @Column(DataType.UUID)
  user_id: string;

  @ForeignKey(() => ContentModel)
  @Column(DataType.UUID)
  content_id: string;
}
