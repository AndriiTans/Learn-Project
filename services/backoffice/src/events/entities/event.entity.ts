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
import { ShiftEntity } from '../../shifts/entities/shift.entity';
import { EventImageEntity } from './event-image.entity';
import { EventVideoEntity } from './event-video.entity';

@Entity({ name: 'events' })
@Index('idx_events_system_started_at', ['systemId', 'startedAt'])
@Index('idx_events_shift_started_at', ['shiftId', 'startedAt'])
export class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'system_id', type: 'uuid' })
  systemId: string;

  @Column({ name: 'started_at', type: 'timestamptz' })
  startedAt: Date;

  @Column({ name: 'ended_at', type: 'timestamptz', nullable: true })
  endedAt: Date | null;

  @Column({ name: 'event_type', nullable: true })
  eventType: string | null;

  @Column({ name: 'shift_id', type: 'uuid', nullable: true })
  shiftId: string | null;

  @ManyToOne(() => ShiftEntity, (shift) => shift.events, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'shift_id' })
  shift: ShiftEntity | null;

  @Column({ type: 'jsonb', nullable: true })
  meta: Record<string, unknown> | null;

  @OneToMany(() => EventVideoEntity, (eventVideo) => eventVideo.event)
  videos: EventVideoEntity[];

  @OneToMany(() => EventImageEntity, (eventImage) => eventImage.event)
  images: EventImageEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
