import { Injectable, ConflictException, Inject } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { IUserRepository } from '../../auth/repositories/iuser.repository';
import { IHashProvider } from '../../../shared/containers/hash/ihash.provider';
import { UserModel } from '../../auth/infra/models/user.model';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IHashProvider)
    private readonly hashProvider: IHashProvider,
  ) {}

  async execute(data: CreateUserDto): Promise<UserModel> {
    const { email, password, registrationNumber, fullName, dateOfBirth, cpf, avatarUrl } = data;

    const userExists = await this.userRepository.findByEmail(email);

    if (userExists) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await this.hashProvider.generateHash(password);

    const savedUser = await this.userRepository.create({
      email,
      passwordHash,
      registrationNumber,
      fullName,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      cpf,
      avatarUrl,
    });

    const userResponse = savedUser.toJSON() as UserModel;
    delete userResponse.passwordHash;

    return userResponse;
  }
}
