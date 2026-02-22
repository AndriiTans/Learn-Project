import {
  CanActivate,
  ExecutionContext,
  InternalServerErrorException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';
import { IS_PUBLIC_KEY } from '../constants/auth.constants';
import { AuthUsersService } from '../services/auth-users.service';

type RequestWithUser = Request & {
  user?: JWTPayload;
};

@Injectable()
export class CognitoAuthGuard implements CanActivate {
  private jwks?: ReturnType<typeof createRemoteJWKSet>;
  private jwksUri?: string;

  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly authUsersService: AuthUsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = request.headers.authorization;
    const token = this.extractBearerToken(authHeader);

    if (!token) {
      throw new UnauthorizedException('Missing or invalid bearer token');
    }

    const payload = await this.verifyToken(token);
    request.user = payload;
    await this.persistAuthData(payload);

    return true;
  }

  private extractBearerToken(
    authHeader: string | string[] | undefined,
  ): string | null {
    if (!authHeader || Array.isArray(authHeader)) {
      return null;
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return null;
    }

    return token;
  }

  private async verifyToken(token: string): Promise<JWTPayload> {
    const userPoolId = this.configService.get<string>('COGNITO_USER_POOL_ID');
    const region = this.configService.get<string>('COGNITO_REGION');
    const issuer =
      this.configService.get<string>('COGNITO_ISSUER') ??
      (region && userPoolId
        ? `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`
        : undefined);
    const clientId = this.configService.get<string>('COGNITO_CLIENT_ID');

    if (!issuer || !userPoolId || !region) {
      throw new UnauthorizedException('Cognito configuration is missing');
    }

    const jwks = this.getJwks(issuer);
    const { payload } = await jwtVerify(token, jwks, { issuer });

    const tokenUse = payload.token_use;
    if (tokenUse !== 'access' && tokenUse !== 'id') {
      throw new UnauthorizedException('Unsupported Cognito token type');
    }

    // Cognito can put app client ID in either "aud" or "client_id".
    if (clientId) {
      const audClaim = payload.aud;
      const clientIdClaim = payload.client_id;
      const audMatches = Array.isArray(audClaim)
        ? audClaim.includes(clientId)
        : audClaim === clientId;
      const clientIdMatches = clientIdClaim === clientId;

      if (!audMatches && !clientIdMatches) {
        throw new UnauthorizedException(
          'Token does not belong to the expected client',
        );
      }
    }

    return payload;
  }

  private getJwks(issuer: string): ReturnType<typeof createRemoteJWKSet> {
    const jwksUri = `${issuer}/.well-known/jwks.json`;

    if (!this.jwks || this.jwksUri !== jwksUri) {
      this.jwksUri = jwksUri;
      this.jwks = createRemoteJWKSet(new URL(jwksUri));
    }

    return this.jwks;
  }

  private async persistAuthData(payload: JWTPayload): Promise<void> {
    try {
      await this.authUsersService.upsertFromJwt(payload);
    } catch {
      throw new InternalServerErrorException('Failed to persist auth data');
    }
  }
}
