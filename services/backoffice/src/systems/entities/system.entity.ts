import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { ShiftEntity } from '../../shifts/entities/shift.entity';
import type { TaskEntity } from '../../tasks/entities/task.entity';

@Entity({ name: 'systems' })
@Index('idx_systems_name', ['name'])
export class SystemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'varchar', unique: true })
  name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany('ShiftEntity', 'system')
  shifts: ShiftEntity[];

  @OneToMany('TaskEntity', 'system')
  tasks: TaskEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
