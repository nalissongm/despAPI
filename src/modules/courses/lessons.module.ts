import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LessonsController } from './infra/controllers/lessons.controller';
import { LessonsService } from './usecases/lessons.service';
import { LessonModel } from './infra/models/lesson.model';
import { MuxModule } from '../mux/mux.module';
import { EnrollmentsModule } from '../enrollments/enrollments.module';
import { CourseModuleModel } from './infra/models/course-module.model';
import { CourseModel } from './infra/models/course.model';

@Module({
  imports: [
    SequelizeModule.forFeature([LessonModel, CourseModuleModel, CourseModel]),
    MuxModule,
    forwardRef(() => EnrollmentsModule),
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService, SequelizeModule],
})
export class LessonsModule {}
