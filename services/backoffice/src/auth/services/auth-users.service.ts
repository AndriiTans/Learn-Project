import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { JWTPayload } from 'jose';
import { Repository } from 'typeorm';
import { AuthUserEntity } from '../entities/auth-user.entity';

@Injectable()
export class AuthUsersService {
  constructor(
    @InjectRepository(AuthUserEntity)
    private readonly authUsersRepository: Repository<AuthUserEntity>,
  ) {}

  async upsertFromJwt(payload: JWTPayload): Promise<void> {
    const cognitoSub = this.getStringClaim(payload, 'sub');
    if (!cognitoSub) {
      return;
    }

    await this.authUsersRepository.upsert(
      {
        cognitoSub,
        email: this.getStringClaim(payload, 'email'),
        username:
          this.getStringClaim(payload, 'cognito:username') ??
          this.getStringClaim(payload, 'username'),
        tokenUse: this.getStringClaim(payload, 'token_use'),
        groups: this.getStringArrayClaim(payload, 'cognito:groups'),
        lastAuthenticatedAt: new Date(),
      },
      ['cognitoSub'],
    );
  }

  private getStringClaim(payload: JWTPayload, key: string): string | null {
    const value = payload[key];
    return typeof value === 'string' ? value : null;
  }

  private getStringArrayClaim(payload: JWTPayload, key: string): string[] {
    const value = payload[key];
    if (Array.isArray(value)) {
      return value.filter((entry): entry is string => typeof entry === 'string');
    }

    if (typeof value === 'string') {
      return [value];
    }

    return [];
  }
}
