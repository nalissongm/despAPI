import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IUserRepository } from '../../auth/repositories/iuser.repository';
import { UserModel } from '../../auth/infra/models/user.model';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    await user.destroy();
  }
}
