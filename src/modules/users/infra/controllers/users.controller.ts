import { Controller, Post, Body, HttpCode, HttpStatus, Get, Param, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { CreateUserUseCase } from '../../usecases/create-user.usecase';
import { UpdateUserUseCase } from '../../usecases/update-user.usecase';
import { DeleteUserUseCase } from '../../usecases/delete-user.usecase';
import { FindUserByIdUseCase } from '../../usecases/find-user-by-id.usecase';
import { RegisterEmailUseCase } from '../../usecases/register-email.usecase';
import { VerifyEmailUseCase } from '../../usecases/verify-email.usecase';
import { CompleteProfileUseCase } from '../../usecases/complete-profile.usecase';
import { CreateStudentUseCase } from '../../usecases/create-student.usecase';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { UpdateUserDto } from '../../dtos/update-user.dto';
import { RegisterEmailDto } from '../../dtos/register-email.dto';
import { VerifyEmailDto } from '../../dtos/verify-email.dto';
import { CompleteProfileDto } from '../../dtos/complete-profile.dto';
import { CreateStudentDto } from '../../dtos/create-student.dto';
import { JwtAuthGuard } from '../../../auth/infra/http/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly registerEmailUseCase: RegisterEmailUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
    private readonly completeProfileUseCase: CompleteProfileUseCase,
    private readonly createStudentUseCase: CreateStudentUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.createUserUseCase.execute(createUserDto);
  }

  @Post('students')
  @HttpCode(HttpStatus.CREATED)
  async createStudent(@Body() createStudentDto: CreateStudentDto) {
    return this.createStudentUseCase.execute(createStudentDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.findUserByIdUseCase.execute(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.updateUserUseCase.execute(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.deleteUserUseCase.execute(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('onboarding/email')
  @HttpCode(HttpStatus.OK)
  async registerEmail(@Req() req: any, @Body() registerEmailDto: RegisterEmailDto) {
    return this.registerEmailUseCase.execute(req.user.id, registerEmailDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('onboarding/verify')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Req() req: any, @Body() verifyEmailDto: VerifyEmailDto) {
    return this.verifyEmailUseCase.execute(req.user.id, verifyEmailDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('onboarding/profile')
  @HttpCode(HttpStatus.OK)
  async completeProfile(@Req() req: any, @Body() completeProfileDto: CompleteProfileDto) {
    return this.completeProfileUseCase.execute(req.user.id, completeProfileDto);
  }
}
