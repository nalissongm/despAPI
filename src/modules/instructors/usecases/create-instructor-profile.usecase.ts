import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InstructorProfileModel } from '../infra/models/instructor-profile.model';
import { UserModel } from '../../auth/infra/models/user.model';
import { CreateInstructorProfileDto } from '../dtos/create-instructor-profile.dto';
import { AssignRoleToUserUseCase } from '../../roles/usecases/assign-role-to-user.usecase';

@Injectable()
export class CreateInstructorProfileUseCase {
  constructor(
    @InjectModel(InstructorProfileModel)
    private readonly instructorProfileModel: typeof InstructorProfileModel,
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
    private readonly assignRoleToUserUseCase: AssignRoleToUserUseCase,
  ) {}

  async execute(data: CreateInstructorProfileDto): Promise<InstructorProfileModel> {
    const user = await this.userModel.findByPk(data.userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const profileExists = await this.instructorProfileModel.findOne({ where: { userId: data.userId } });
    if (profileExists) {
      throw new ConflictException('Instructor profile already exists for this user.');
    }

    const profile = await this.instructorProfileModel.create(data as any);

    // Automatically assign the INSTRUCTOR role via associative table
    await this.assignRoleToUserUseCase.execute(data.userId, 'INSTRUCTOR');
    
    return profile;
  }
}
