import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthUserEntity } from '../auth/entities/auth-user.entity';
import { UserShiftEntity } from '../shifts/entities/user-shift.entity';
import { EventsController } from './events.controller';
import { EventEntity } from './entities/event.entity';
import { EventImageEntity } from './entities/event-image.entity';
import { EventVideoEntity } from './entities/event-video.entity';
import { EventsService } from './events.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EventEntity,
      EventVideoEntity,
      EventImageEntity,
      AuthUserEntity,
      UserShiftEntity,
    ]),
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule { }
