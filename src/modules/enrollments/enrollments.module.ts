import { Module } from '@nestjs/common';
import { EnrollmentModel } from './infra/models/enrollment.model';

@Module({
  providers: [
    {
      provide: 'ENROLLMENT_REPOSITORY',
      useValue: EnrollmentModel,
    },
  ],
  exports: ['ENROLLMENT_REPOSITORY'],
})
export class EnrollmentsModule {}
