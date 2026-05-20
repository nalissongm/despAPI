import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CourseModel } from './infra/models/course.model';
import { CourseModuleModel } from './infra/models/course-module.model';
import { LessonModel } from './infra/models/lesson.model';

@Module({
  imports: [
    SequelizeModule.forFeature([CourseModel, CourseModuleModel, LessonModel]),
  ],
  providers: [],
  exports: [SequelizeModule],
})
export class CoursesModule {}
