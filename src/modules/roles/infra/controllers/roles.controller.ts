import { Controller, Post, Body, Get, Delete, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateRoleUseCase } from '../../usecases/create-role.usecase';
import { FindAllRolesUseCase } from '../../usecases/find-all-roles.usecase';
import { DeleteRoleUseCase } from '../../usecases/delete-role.usecase';
import { CreateRoleDto } from '../../dtos/create-role.dto';

@Controller('roles')
export class RolesController {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly findAllRolesUseCase: FindAllRolesUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.createRoleUseCase.execute(createRoleDto);
  }

  @Get()
  async findAll() {
    return this.findAllRolesUseCase.execute();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.deleteRoleUseCase.execute(id);
  }
}
