import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateInstructorProfileUseCase } from '../../usecases/create-instructor-profile.usecase';
import { CreateInstructorProfileDto } from '../../dtos/create-instructor-profile.dto';

@Controller('instructors')
export class InstructorsController {
  constructor(private readonly createInstructorProfileUseCase: CreateInstructorProfileUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createInstructorProfileDto: CreateInstructorProfileDto) {
    return this.createInstructorProfileUseCase.execute(createInstructorProfileDto);
  }
}
