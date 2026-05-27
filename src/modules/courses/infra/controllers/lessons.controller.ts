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
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { LessonsService } from '../../usecases/lessons.service';
import { MuxService } from '../../../mux/mux.service';
import { CreateLessonDto } from '../../dtos/create-lesson.dto';
import { UpdateLessonDto } from '../../dtos/update-lesson.dto';
import { ReorderDto } from '../../dtos/reorder.dto';
import { RolesGuard } from '../../../auth/infra/http/guards/roles.guard';
import { EnrollmentGuard } from '../../../enrollments/infra/http/guards/enrollment.guard';
import { Roles } from '../../../auth/infra/http/decorators/roles.decorator';

@Controller()
@UseGuards(RolesGuard)
export class LessonsController {
  constructor(
    private readonly lessonsService: LessonsService,
    private readonly muxService: MuxService,
  ) {}

  @Post('modules/:moduleId/lessons')
  @Roles('admin', 'ADMIN', 'instructor', 'INSTRUCTOR')
  @UseGuards(EnrollmentGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Param('moduleId') moduleId: string, @Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.create(moduleId, createLessonDto);
  }

  @Get('modules/:moduleId/lessons')
  @UseGuards(EnrollmentGuard)
  findAll(@Param('moduleId') moduleId: string) {
    return this.lessonsService.findAll(moduleId);
  }

  @Get('lessons/:id')
  @UseGuards(EnrollmentGuard)
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(id);
  }

  @Patch('lessons/:id')
  @Roles('admin', 'ADMIN', 'instructor', 'INSTRUCTOR')
  @UseGuards(EnrollmentGuard)
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonsService.update(id, updateLessonDto);
  }

  @Delete('lessons/:id')
  @Roles('admin', 'ADMIN', 'instructor', 'INSTRUCTOR')
  @UseGuards(EnrollmentGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(id);
  }

  @Patch('modules/:moduleId/lessons/reorder')
  @Roles('admin', 'ADMIN', 'instructor', 'INSTRUCTOR')
  @UseGuards(EnrollmentGuard)
  @HttpCode(HttpStatus.OK)
  reorder(@Param('moduleId') moduleId: string, @Body() reorderDto: ReorderDto) {
    return this.lessonsService.reorder(moduleId, reorderDto);
  }

  @Post('lessons/:id/mux-upload-url')
  @Roles('admin', 'ADMIN', 'instructor', 'INSTRUCTOR')
  @UseGuards(EnrollmentGuard)
  @HttpCode(HttpStatus.OK)
  async getMuxUploadUrl(@Param('id') id: string) {
    const lesson = await this.lessonsService.findOne(id);

    if (lesson.contentType !== 'video') {
      throw new BadRequestException('Mux upload is only allowed for video lessons.');
    }

    return this.muxService.createDirectUploadUrl(lesson.id);
  }
}
