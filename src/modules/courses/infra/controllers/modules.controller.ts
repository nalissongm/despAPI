import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ModulesService } from '../../usecases/modules.service';
import { CreateModuleDto } from '../../dtos/create-module.dto';
import { UpdateModuleDto } from '../../dtos/update-module.dto';
import { ReorderDto } from '../../dtos/reorder.dto';
import { RolesGuard } from '../../../auth/infra/http/guards/roles.guard';
import { EnrollmentGuard } from '../../../enrollments/infra/http/guards/enrollment.guard';
import { Roles } from '../../../auth/infra/http/decorators/roles.decorator';

@Controller()
@UseGuards(RolesGuard)
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post('courses/:courseId/modules')
  @Roles('admin', 'ADMIN', 'instructor', 'INSTRUCTOR')
  @HttpCode(HttpStatus.CREATED)
  create(@Param('courseId') courseId: string, @Body() createModuleDto: CreateModuleDto) {
    return this.modulesService.create(courseId, createModuleDto);
  }

  @Get('courses/:courseId/modules')
  @UseGuards(EnrollmentGuard)
  findAll(@Param('courseId') courseId: string) {
    return this.modulesService.findAll(courseId);
  }

  @Patch('modules/:id')
  @Roles('admin', 'ADMIN', 'instructor', 'INSTRUCTOR')
  @UseGuards(EnrollmentGuard) // Instructor must be of the course, EnrollmentGuard handles that check
  update(@Param('id') id: string, @Body() updateModuleDto: UpdateModuleDto) {
    return this.modulesService.update(id, updateModuleDto);
  }

  @Delete('modules/:id')
  @Roles('admin', 'ADMIN', 'instructor', 'INSTRUCTOR')
  @UseGuards(EnrollmentGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.modulesService.remove(id);
  }

  @Patch('courses/:courseId/modules/reorder')
  @Roles('admin', 'ADMIN', 'instructor', 'INSTRUCTOR')
  @UseGuards(EnrollmentGuard)
  @HttpCode(HttpStatus.OK)
  reorder(@Param('courseId') courseId: string, @Body() reorderDto: ReorderDto) {
    return this.modulesService.reorder(courseId, reorderDto);
  }
}
