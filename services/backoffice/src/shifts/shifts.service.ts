import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthUserEntity } from '../auth/entities/auth-user.entity';
import { ShiftEntity } from './entities/shift.entity';
import { UserShiftEntity } from './entities/user-shift.entity';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectRepository(ShiftEntity)
    private readonly shiftsRepository: Repository<ShiftEntity>,
    @InjectRepository(AuthUserEntity)
    private readonly authUsersRepository: Repository<AuthUserEntity>,
    @InjectRepository(UserShiftEntity)
    private readonly usersShiftsRepository: Repository<UserShiftEntity>,
  ) { }

  async assignUserToShift(shiftId: string, userId: string): Promise<void> {
    const [shiftExists, userExists] = await Promise.all([
      this.shiftsRepository.existsBy({ id: shiftId }),
      this.authUsersRepository.existsBy({ id: userId }),
    ]);

    if (!shiftExists) {
      throw new NotFoundException('Shift not found');
    }

    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    await this.usersShiftsRepository.upsert({ shiftId, userId }, ['userId', 'shiftId']);
  }
}
