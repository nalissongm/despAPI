import { Injectable, ConflictException, Inject } from '@nestjs/common';
import { CreateStudentDto } from '../dtos/create-student.dto';
import { IUserRepository } from '../../auth/repositories/iuser.repository';
import { IHashProvider } from '../../../shared/containers/hash/ihash.provider';
import { UserModel } from '../../auth/infra/models/user.model';
import { RoleModel } from '../../roles/infra/models/role.model';
import { UserRoleModel } from '../../roles/infra/models/user-role.model';

@Injectable()
export class CreateStudentUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IHashProvider)
    private readonly hashProvider: IHashProvider,
    @Inject('USER_MODEL')
    private readonly userModel: typeof UserModel,
    @Inject('ROLE_MODEL')
    private readonly roleModel: typeof RoleModel,
    @Inject('USER_ROLE_MODEL')
    private readonly userRoleModel: typeof UserRoleModel,
  ) {}

  async execute(data: CreateStudentDto): Promise<UserModel> {
    const { registrationNumber, password } = data;

    // 1. Check if user with registration number already exists
    const userExists = await this.userModel.findOne({
      where: { registrationNumber },
    });

    if (userExists) {
      throw new ConflictException('Registration number already in use');
    }

    // 2. Hash the password
    const passwordHash = await this.hashProvider.generateHash(password);

    // 3. Create the User
    const savedUser = await this.userModel.create({
      registrationNumber,
      passwordHash,
      email: null,
      onboardingStep: 'PENDING_EMAIL',
    } as any);

    // 4. Find or create the 'STUDENT' role
    const [role] = await this.roleModel.findOrCreate({
      where: { name: 'STUDENT' },
    });

    // 5. Create the UserRole relationship
    await this.userRoleModel.create({
      userId: savedUser.id,
      roleId: role.id,
    } as any);

    // 6. Return sanitized user
    const userResponse = savedUser.toJSON() as UserModel;
    delete userResponse.passwordHash;

    return userResponse;
  }
}
