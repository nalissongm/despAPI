import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateUserUseCase } from '../../usecases/create-user.usecase';
import { CreateUserDto } from '../../dtos/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.createUserUseCase.execute(createUserDto);
  }
}
