import { Module } from '@nestjs/common';
import { FileModel } from './infra/models/file.model';
import { LessonFileModel } from './infra/models/lesson-file.model';

@Module({
  providers: [
    {
      provide: 'FILE_REPOSITORY',
      useValue: FileModel,
    },
    {
      provide: 'LESSON_FILE_REPOSITORY',
      useValue: LessonFileModel,
    },
  ],
  exports: ['FILE_REPOSITORY', 'LESSON_FILE_REPOSITORY'],
})
export class FilesModule {}
