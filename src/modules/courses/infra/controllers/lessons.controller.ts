import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { LessonsService } from '../../usecases/lessons.service';
import { MuxService } from '../../../mux/mux.service';
import { CreateLessonDto } from '../../dtos/create-lesson.dto';
import { UpdateLessonDto } from '../../dtos/update-lesson.dto';
import { ReorderDto } from '../../dtos/reorder.dto';

@Controller()
export class LessonsController {
  constructor(
    private readonly lessonsService: LessonsService,
    private readonly muxService: MuxService,
  ) {}

  @Post('modules/:moduleId/lessons')
  @HttpCode(HttpStatus.CREATED)
  create(@Param('moduleId') moduleId: string, @Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.create(moduleId, createLessonDto);
  }

  @Get('modules/:moduleId/lessons')
  findAll(@Param('moduleId') moduleId: string) {
    return this.lessonsService.findAll(moduleId);
  }

  @Get('lessons/:id')
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(id);
  }

  @Patch('lessons/:id')
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonsService.update(id, updateLessonDto);
  }

  @Delete('lessons/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(id);
  }

  @Patch('modules/:moduleId/lessons/reorder')
  @HttpCode(HttpStatus.OK)
  reorder(@Param('moduleId') moduleId: string, @Body() reorderDto: ReorderDto) {
    return this.lessonsService.reorder(moduleId, reorderDto);
  }

  @Post('lessons/:id/mux-upload-url')
  @HttpCode(HttpStatus.OK)
  async getMuxUploadUrl(@Param('id') id: string) {
    const lesson = await this.lessonsService.findOne(id);

    if (lesson.contentType !== 'video') {
      throw new BadRequestException('Mux upload is only allowed for video lessons.');
    }

    return this.muxService.createDirectUploadUrl(lesson.id);
  }
}
