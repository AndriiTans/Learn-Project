import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

type RequestWithUser = Request & {
  user?: Record<string, unknown>;
};

export const CurrentUser = createParamDecorator(
  (
    _data: unknown,
    ctx: ExecutionContext,
  ): Record<string, unknown> | undefined => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
