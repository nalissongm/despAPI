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
    const { email, password } = data;

    // Check if email is already taken
    const userExists = await this.userRepository.findByEmail(email);

    if (userExists) {
      throw new ConflictException('Email already in use');
    }

    // Encrypt raw password
    const passwordHash = await this.hashProvider.generateHash(password);

    // Create and persist new user using the repository
    const savedUser = await this.userRepository.create({
      email,
      password_hash: passwordHash,
    });

    // Remove password hash from the response object
    // Since UserModel is a Sequelize model, we can use toJSON() or just avoid returning the field.
    const userResponse = savedUser.toJSON() as UserModel;
    delete userResponse.password_hash;

    return userResponse;
  }
}
