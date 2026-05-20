import { Module } from '@nestjs/common';
import { CourseModel } from './infra/models/course.model';
import { CourseModuleModel } from './infra/models/course-module.model';
import { LessonModel } from './infra/models/lesson.model';

@Module({
  providers: [
    {
      provide: 'COURSE_REPOSITORY',
      useValue: CourseModel,
    },
    {
      provide: 'COURSE_MODULE_REPOSITORY',
      useValue: CourseModuleModel,
    },
    {
      provide: 'LESSON_REPOSITORY',
      useValue: LessonModel,
    },
  ],
  exports: [
    'COURSE_REPOSITORY',
    'COURSE_MODULE_REPOSITORY',
    'LESSON_REPOSITORY',
  ],
})
export class CoursesModule {}
