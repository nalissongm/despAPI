// src/modules/auth/repositories/iuser.repository.ts

import { UserModel } from '../infra/models/user.model';

export abstract class IUserRepository {
  abstract findByEmail(email: string): Promise<UserModel | null>;
  abstract findById(id: string): Promise<UserModel | null>;
  abstract save(user: UserModel): Promise<UserModel>;
}
