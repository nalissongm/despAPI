import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EnrollmentModel } from './infra/models/enrollment.model';
import { EnrollmentsService } from './usecases/enrollments.service';
import { EnrollmentsController } from './infra/controllers/enrollments.controller';
import { UserModel } from '../auth/infra/models/user.model';
import { CourseModel } from '../courses/infra/models/course.model';
import { CourseModuleModel } from '../courses/infra/models/course-module.model';
import { LessonModel } from '../courses/infra/models/lesson.model';
import { InstructorProfileModel } from '../instructors/infra/models/instructor-profile.model';
import { EnrollmentGuard } from './infra/http/guards/enrollment.guard';

@Module({
  imports: [
    SequelizeModule.forFeature([
      EnrollmentModel,
      UserModel,
      CourseModel,
      CourseModuleModel,
      LessonModel,
      InstructorProfileModel,
    ]),
  ],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService, EnrollmentGuard],
  exports: [EnrollmentsService, EnrollmentGuard, SequelizeModule],
})
export class EnrollmentsModule {}
