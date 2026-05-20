import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { IUserRepository } from '../../auth/repositories/iuser.repository';
import { IHashProvider } from '../../../shared/containers/hash/ihash.provider';
import { UserModel } from '../../auth/infra/models/user.model';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IHashProvider)
    private readonly hashProvider: IHashProvider,
  ) {}

  async execute(id: string, data: UpdateUserDto): Promise<UserModel> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (data.password) {
      data.password = await this.hashProvider.generateHash(data.password);
    }

    const updatedData: any = { ...data };
    if (updatedData.password) {
      updatedData.passwordHash = updatedData.password;
      delete updatedData.password;
    }
    
    if (updatedData.dateOfBirth) {
      updatedData.dateOfBirth = new Date(updatedData.dateOfBirth);
    }

    await user.update(updatedData);

    const userResponse = user.toJSON() as UserModel;
    delete userResponse.passwordHash;

    return userResponse;
  }
}
