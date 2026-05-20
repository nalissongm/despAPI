// src/modules/auth/repositories/sequelize.user.repository.ts

import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from './iuser.repository';
import { UserModel } from '../infra/models/user.model';

@Injectable()
export class SequelizeUserRepository implements IUserRepository {
  constructor(
    @Inject('USER_MODEL')
    private readonly userModel: typeof UserModel,
  ) {}

  /**
   * Finds a user by their email address.
   * @param email The user's email.
   * @returns A promise that resolves to the user model or null if not found.
   */
  async findByEmail(email: string): Promise<UserModel | null> {
    return this.userModel.findOne({ where: { email } });
  }

  /**
   * Finds a user by their ID.
   * @param id The user's ID.
   * @returns A promise that resolves to the user model or null if not found.
   */
  async findById(id: string): Promise<UserModel | null> {
    return this.userModel.findByPk(id);
  }

  /**
   * Finds a user by their recovery token.
   * @param token The recovery token.
   * @returns A promise that resolves to the user model or null if not found.
   */
  async findByRecoveryToken(token: string): Promise<UserModel | null> {
    return this.userModel.findOne({ where: { recoveryToken: token } });
  }

  /**
   * Creates a new user instance.
   * @param data The user data.
   * @returns A promise that resolves to the created user model.
   */
  async create(data: Partial<UserModel>): Promise<UserModel> {
    return this.userModel.create(data as any);
  }

  /**
   * Saves a user entity. This can be an insert or an update.
   * @param user The user model instance to save.
   * @returns A promise that resolves to the saved user model.
   */
  async save(user: UserModel): Promise<UserModel> {
    return user.save();
  }
}
