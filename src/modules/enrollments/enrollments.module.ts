import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EnrollmentModel } from './infra/models/enrollment.model';
import { EnrollmentsController } from './infra/controllers/enrollments.controller';
import { CreateEnrollmentUseCase } from './usecases/create-enrollment.usecase';
import { UserModel } from '../auth/infra/models/user.model';
import { CourseModel } from '../courses/infra/models/course.model';

@Module({
  imports: [
    SequelizeModule.forFeature([EnrollmentModel, UserModel, CourseModel]),
  ],
  controllers: [EnrollmentsController],
  providers: [CreateEnrollmentUseCase],
})
export class EnrollmentsModule {}
