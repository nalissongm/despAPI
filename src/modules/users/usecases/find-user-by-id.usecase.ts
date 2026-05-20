import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IUserRepository } from '../../auth/repositories/iuser.repository';
import { UserModel } from '../../auth/infra/models/user.model';

@Injectable()
export class FindUserByIdUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<UserModel> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const userResponse = user.toJSON() as UserModel;
    delete userResponse.passwordHash;

    return userResponse;
  }
}
