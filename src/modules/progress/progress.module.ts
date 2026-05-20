import { Module } from '@nestjs/common';
import { UserLessonProgressModel } from './infra/models/user-lesson-progress.model';

@Module({
  providers: [
    {
      provide: 'USER_LESSON_PROGRESS_REPOSITORY',
      useValue: UserLessonProgressModel,
    },
  ],
  exports: ['USER_LESSON_PROGRESS_REPOSITORY'],
})
export class ProgressModule {}
