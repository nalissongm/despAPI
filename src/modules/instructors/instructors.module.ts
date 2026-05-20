import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InstructorProfileModel } from './infra/models/instructor-profile.model';
import { InstructorsController } from './infra/controllers/instructors.controller';
import { CreateInstructorProfileUseCase } from './usecases/create-instructor-profile.usecase';
import { RolesModule } from '../roles/roles.module';
import { UserModel } from '../auth/infra/models/user.model';

@Module({
  imports: [
    SequelizeModule.forFeature([InstructorProfileModel, UserModel]),
    RolesModule,
  ],
  controllers: [InstructorsController],
  providers: [CreateInstructorProfileUseCase],
})
export class InstructorsModule {}
