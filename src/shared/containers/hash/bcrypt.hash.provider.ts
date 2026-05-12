// src/shared/containers/hash/bcrypt.hash.provider.ts

import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { IHashProvider } from './ihash.provider';

@Injectable()
export class BcryptHashProvider implements IHashProvider {
  /**
   * Generates a hash for the given payload.
   * @param payload The string to hash.
   * @returns A promise that resolves to the hashed string.
   */
  async generateHash(payload: string): Promise<string> {
    return hash(payload, 8);
  }

  /**
   * Compares a plain text payload with a hashed string.
   * @param payload The plain text string.
   * @param hashed The hashed string to compare against.
   * @returns A promise that resolves to true if the payload matches the hash, false otherwise.
   */
  async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}
