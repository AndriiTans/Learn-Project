import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthUserEntity } from '../auth/entities/auth-user.entity';
import { EventEntity } from './entities/event.entity';
import { UserShiftEntity } from '../shifts/entities/user-shift.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventsRepository: Repository<EventEntity>,
    @InjectRepository(AuthUserEntity)
    private readonly authUsersRepository: Repository<AuthUserEntity>,
    @InjectRepository(UserShiftEntity)
    private readonly userShiftsRepository: Repository<UserShiftEntity>,
  ) { }

  async getEventsForCognitoUser(cognitoSub: string): Promise<EventEntity[]> {
    const user = await this.authUsersRepository.findOne({ where: { cognitoSub } });
    if (!user) {
      return [];
    }

    const shiftRows = await this.userShiftsRepository.find({
      where: { userId: user.id },
      select: { shiftId: true },
    });
    const shiftIds = shiftRows.map((row) => row.shiftId);

    if (shiftIds.length === 0) {
      return [];
    }

    return this.eventsRepository
      .createQueryBuilder('event')
      .where('event.shift_id IN (:...shiftIds)', { shiftIds })
      .orderBy('event.started_at', 'DESC')
      .getMany();
  }
}
