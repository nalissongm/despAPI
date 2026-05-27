import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ModulesController } from './infra/controllers/modules.controller';
import { ModulesService } from './usecases/modules.service';
import { CourseModuleModel } from './infra/models/course-module.model';
import { EnrollmentsModule } from '../enrollments/enrollments.module';
import { CourseModel } from './infra/models/course.model';
import { LessonModel } from './infra/models/lesson.model';

@Module({
  imports: [
    SequelizeModule.forFeature([CourseModuleModel, CourseModel, LessonModel]),
    forwardRef(() => EnrollmentsModule),
  ],
  controllers: [ModulesController],
  providers: [ModulesService],
  exports: [ModulesService, SequelizeModule],
})
export class ModulesModule {}
