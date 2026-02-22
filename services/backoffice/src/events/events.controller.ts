import { Controller, Get, UnauthorizedException } from '@nestjs/common';
import type { JWTPayload } from 'jose';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('my')
  async getMyEvents(
    @CurrentUser() user: (Record<string, unknown> & JWTPayload) | undefined,
  ) {
    const cognitoSub = typeof user?.sub === 'string' ? user.sub : null;
    if (!cognitoSub) {
      throw new UnauthorizedException('Missing cognito subject');
    }

    return this.eventsService.getEventsForCognitoUser(cognitoSub);
  }
}
