import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateEnrollmentUseCase } from '../../usecases/create-enrollment.usecase';
import { CreateEnrollmentDto } from '../../dtos/create-enrollment.dto';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly createEnrollmentUseCase: CreateEnrollmentUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return this.createEnrollmentUseCase.execute(createEnrollmentDto);
  }
}
