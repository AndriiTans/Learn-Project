import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventEntity } from '../../events/entities/event.entity';
import { SystemEntity } from '../../systems/entities/system.entity';
import { UserShiftEntity } from './user-shift.entity';

@Entity({ name: 'shifts' })
@Index('idx_shifts_system_started_at', ['systemId', 'startedAt'])
export class ShiftEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'system_id', type: 'uuid' })
  systemId: string;

  @ManyToOne(() => SystemEntity)
  @JoinColumn({ name: 'system_id' })
  system: SystemEntity;

  @Column({ name: 'started_at', type: 'timestamptz' })
  startedAt: Date;

  @Column({ name: 'ended_at', type: 'timestamptz' })
  endedAt: Date;

  @OneToMany(() => UserShiftEntity, (userShift) => userShift.shift)
  userShifts: UserShiftEntity[];

  @OneToMany(() => EventEntity, (event) => event.shift)
  events: EventEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
