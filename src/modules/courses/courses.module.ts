import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CoursesController } from './infra/controllers/courses.controller';
import { CoursesService } from './usecases/courses.service';
import { CourseModel } from './infra/models/course.model';
import { CourseModuleModel } from './infra/models/course-module.model';
import { LessonModel } from './infra/models/lesson.model';
import { IStorageProvider } from '../../shared/containers/storage/istorage.provider';
import { DiskStorageProvider } from '../../shared/containers/storage/disk-storage.provider';
import { ModulesModule } from './modules.module';
import { LessonsModule } from './lessons.module';
import { InstructorProfileModel } from '../instructors/infra/models/instructor-profile.model';

@Module({
  imports: [
    SequelizeModule.forFeature([CourseModel, CourseModuleModel, LessonModel, InstructorProfileModel]),
    ModulesModule,
    LessonsModule,
  ],
  controllers: [CoursesController],
  providers: [
    CoursesService,
    {
      provide: IStorageProvider,
      useClass: DiskStorageProvider,
    },
  ],
  exports: [CoursesService, ModulesModule, LessonsModule],
})
export class CoursesModule {}
