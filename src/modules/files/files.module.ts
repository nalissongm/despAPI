import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FileModel } from './infra/models/file.model';
import { LessonFileModel } from './infra/models/lesson-file.model';

@Module({
  imports: [
    SequelizeModule.forFeature([FileModel, LessonFileModel]),
  ],
  providers: [],
  exports: [SequelizeModule],
})
export class FilesModule {}
