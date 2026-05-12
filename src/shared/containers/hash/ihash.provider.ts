// src/shared/containers/hash/ihash.provider.ts

export abstract class IHashProvider {
  abstract generateHash(payload: string): Promise<string>;
  abstract compareHash(payload: string, hashed: string): Promise<boolean>;
}
