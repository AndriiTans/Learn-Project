import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthUserEntity } from '../auth/entities/auth-user.entity';
import { ShiftEntity } from './entities/shift.entity';
import { UserShiftEntity } from './entities/user-shift.entity';
import { ShiftsController } from './shifts.controller';
import { ShiftsService } from './shifts.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShiftEntity, AuthUserEntity, UserShiftEntity])],
  controllers: [ShiftsController],
  providers: [ShiftsService],
})
export class ShiftsModule { }
