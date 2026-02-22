import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthUserEntity } from '../../auth/entities/auth-user.entity';
import { ShiftEntity } from './shift.entity';

@Entity({ name: 'users_shifts' })
@Index('idx_users_shifts_user_shift_unique', ['userId', 'shiftId'], {
  unique: true,
})
@Index('idx_users_shifts_shift_id', ['shiftId'])
export class UserShiftEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'shift_id', type: 'uuid' })
  shiftId: string;

  @ManyToOne(() => AuthUserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: AuthUserEntity;

  @ManyToOne(() => ShiftEntity, (shift) => shift.userShifts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'shift_id' })
  shift: ShiftEntity;

  @CreateDateColumn({ name: 'assigned_at', type: 'timestamptz' })
  assignedAt: Date;
}
