import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AuthUserEntity } from '../../auth/entities/auth-user.entity';
import { ShiftEntity } from '../../shifts/entities/shift.entity';
import { SystemEntity } from '../../systems/entities/system.entity';
import { TaskEntityType } from '../enums/task-entity-type.enum';
import { TaskStatus } from '../enums/task-status.enum';

@Entity({ name: 'tasks' })
@Index('idx_tasks_shift_status', ['shiftId', 'status'])
@Index('idx_tasks_worker_status', ['workerId', 'status'])
@Index('idx_tasks_shift_priority_created', ['shiftId', 'priority', 'createdAt'])
@Index('idx_tasks_system_status', ['systemId', 'status'])
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'shift_id', type: 'uuid' })
  shiftId: string;

  @ManyToOne(() => ShiftEntity)
  @JoinColumn({ name: 'shift_id' })
  shift: ShiftEntity;

  @Column({ name: 'system_id', type: 'uuid' })
  systemId: string;

  @ManyToOne(() => SystemEntity)
  @JoinColumn({ name: 'system_id' })
  system: SystemEntity;

  @Column({
    name: 'entity_type',
    type: 'enum',
    enum: TaskEntityType,
  })
  entityType: TaskEntityType;

  @Column({ name: 'entity_id', type: 'uuid' })
  entityId: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @Column({ name: 'priority', type: 'int', default: 0 })
  priority: number;

  @Column({ name: 'worker_id', type: 'uuid', nullable: true })
  workerId?: string;

  @ManyToOne(() => AuthUserEntity, { nullable: true })
  @JoinColumn({ name: 'worker_id' })
  worker?: AuthUserEntity;

  @Column({ name: 'sub_type', type: 'varchar', nullable: true })
  subType?: string;

  @Column({ name: 'worker_comment', type: 'text', nullable: true })
  workerComment?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ name: 'started_at', type: 'timestamptz', nullable: true })
  startedAt?: Date;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
