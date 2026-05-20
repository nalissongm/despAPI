import { Module } from '@nestjs/common';
import { InstructorProfileModel } from './infra/models/instructor-profile.model';

@Module({
  providers: [
    {
      provide: 'INSTRUCTOR_PROFILE_REPOSITORY',
      useValue: InstructorProfileModel,
    },
  ],
  exports: ['INSTRUCTOR_PROFILE_REPOSITORY'],
})
export class InstructorsModule {}
