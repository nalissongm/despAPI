import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { EnrollmentsService } from '../../usecases/enrollments.service';
import { CreateEnrollmentDto } from '../../dtos/create-enrollment.dto';
import { JwtAuthGuard } from '../../../auth/infra/http/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infra/http/guards/roles.guard';
import { Roles } from '../../../auth/infra/http/decorators/roles.decorator';

@Controller('enrollments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  @Roles('admin', 'ADMIN') // Only admins can manually create enrollments for now
  async create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return this.enrollmentsService.createEnrollment(createEnrollmentDto);
  }

  @Get('me')
  async findMyEnrollments(@Req() req) {
    return this.enrollmentsService.findByUser(req.user.id);
  }
}
