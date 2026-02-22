import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { ROLES_KEY } from '../constants/auth.constants';

type RequestWithUser = Request & {
  user?: Record<string, unknown>;
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    const groups = this.extractGroups(user);
    const hasRole = requiredRoles.some((role) => groups.includes(role));

    if (!hasRole) {
      throw new ForbiddenException('Insufficient role');
    }

    return true;
  }

  private extractGroups(user: Record<string, unknown> | undefined): string[] {
    if (!user) {
      return [];
    }

    const groupsClaim = user['cognito:groups'];
    if (Array.isArray(groupsClaim)) {
      return groupsClaim.filter(
        (group): group is string => typeof group === 'string',
      );
    }

    if (typeof groupsClaim === 'string') {
      return [groupsClaim];
    }

    return [];
  }
}
