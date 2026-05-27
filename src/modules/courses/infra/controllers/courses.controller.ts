import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CoursesService } from '../../usecases/courses.service';
import { CreateCourseDto } from '../../dtos/create-course.dto';
import { UpdateCourseDto } from '../../dtos/update-course.dto';
import uploadConfig from '../../../../config/upload';
import { RolesGuard } from '../../../auth/infra/http/guards/roles.guard';
import { EnrollmentGuard } from '../../../enrollments/infra/http/guards/enrollment.guard';
import { Roles } from '../../../auth/infra/http/decorators/roles.decorator';

@Controller('courses')
@UseGuards(RolesGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  findAll(
    @Req() req: any,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
  ) {
    return this.coursesService.findAll(limit, offset, req.user);
  }

  @Get(':id')
  @UseGuards(EnrollmentGuard)
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'INSTRUCTOR')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto, @Req() req: any) {
    return this.coursesService.update(id, updateCourseDto, req.user);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }

  @Patch(':id/cover')
  @Roles('ADMIN', 'INSTRUCTOR')
  @UseInterceptors(FileInterceptor('file', uploadConfig.multer))
  patchCover(@Param('id') id: string, @UploadedFile() file: Express.Multer.File, @Req() req: any) {
    return this.coursesService.uploadCover(id, file.filename, req.user);
  }
}
