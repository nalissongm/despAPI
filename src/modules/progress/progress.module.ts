import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserLessonProgressModel } from './infra/models/user-lesson-progress.model';

@Module({
  imports: [
    SequelizeModule.forFeature([UserLessonProgressModel]),
  ],
  providers: [],
  exports: [SequelizeModule],
})
export class ProgressModule {}
