import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ModulesService } from '../../usecases/modules.service';
import { CreateModuleDto } from '../../dtos/create-module.dto';
import { UpdateModuleDto } from '../../dtos/update-module.dto';
import { ReorderDto } from '../../dtos/reorder.dto';

@Controller()
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post('courses/:courseId/modules')
  @HttpCode(HttpStatus.CREATED)
  create(@Param('courseId') courseId: string, @Body() createModuleDto: CreateModuleDto) {
    return this.modulesService.create(courseId, createModuleDto);
  }

  @Get('courses/:courseId/modules')
  findAll(@Param('courseId') courseId: string) {
    return this.modulesService.findAll(courseId);
  }

  @Patch('modules/:id')
  update(@Param('id') id: string, @Body() updateModuleDto: UpdateModuleDto) {
    return this.modulesService.update(id, updateModuleDto);
  }

  @Delete('modules/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.modulesService.remove(id);
  }

  @Patch('courses/:courseId/modules/reorder')
  @HttpCode(HttpStatus.OK)
  reorder(@Param('courseId') courseId: string, @Body() reorderDto: ReorderDto) {
    return this.modulesService.reorder(courseId, reorderDto);
  }
}
