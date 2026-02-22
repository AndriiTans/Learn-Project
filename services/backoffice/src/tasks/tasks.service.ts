import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './entities/task.entity';
import { TaskEntityType } from './enums/task-entity-type.enum';
import { TaskStatus } from './enums/task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly tasksRepository: Repository<TaskEntity>,
  ) {}

  async createTask(
    shiftId: string,
    systemId: string,
    entityType: TaskEntityType,
    entityId: string,
    priority: number = 0,
    subType?: string,
  ): Promise<TaskEntity> {
    const task = this.tasksRepository.create({
      shiftId,
      systemId,
      entityType,
      entityId,
      priority,
      subType,
      status: TaskStatus.PENDING,
    });

    return this.tasksRepository.save(task);
  }

  async getNextTaskForWorker(
    workerId: string,
    shiftId: string,
  ): Promise<TaskEntity | null> {
    const task = await this.tasksRepository.findOne({
      where: {
        shiftId,
        status: TaskStatus.PENDING,
      },
      order: {
        priority: 'DESC',
        createdAt: 'ASC',
      },
    });

    if (!task) {
      return null;
    }

    task.status = TaskStatus.ASSIGNED;
    task.workerId = workerId;
    task.startedAt = new Date();

    return this.tasksRepository.save(task);
  }

  async startTask(taskId: string, workerId: string): Promise<TaskEntity> {
    const task = await this.tasksRepository.findOne({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.workerId !== workerId) {
      throw new BadRequestException('Task is not assigned to this worker');
    }

    if (task.status !== TaskStatus.ASSIGNED) {
      throw new BadRequestException('Task is not in assigned status');
    }

    task.status = TaskStatus.IN_PROGRESS;
    task.startedAt = new Date();

    return this.tasksRepository.save(task);
  }

  async completeTask(
    taskId: string,
    workerId: string,
    comment?: string,
  ): Promise<TaskEntity> {
    const task = await this.tasksRepository.findOne({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.workerId !== workerId) {
      throw new BadRequestException('Task is not assigned to this worker');
    }

    task.status = TaskStatus.COMPLETED;
    task.completedAt = new Date();
    if (comment) {
      task.workerComment = comment;
    }

    return this.tasksRepository.save(task);
  }

  async failTask(
    taskId: string,
    workerId: string,
    comment?: string,
  ): Promise<TaskEntity> {
    const task = await this.tasksRepository.findOne({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.workerId !== workerId) {
      throw new BadRequestException('Task is not assigned to this worker');
    }

    task.status = TaskStatus.FAILED;
    task.completedAt = new Date();
    if (comment) {
      task.workerComment = comment;
    }

    return this.tasksRepository.save(task);
  }

  async getMyTasks(
    workerId: string,
    status?: TaskStatus,
  ): Promise<TaskEntity[]> {
    const where: any = { workerId };
    if (status) {
      where.status = status;
    }

    return this.tasksRepository.find({
      where,
      order: { createdAt: 'DESC' },
      relations: ['shift'],
    });
  }

  async getTasksByShift(shiftId: string): Promise<TaskEntity[]> {
    return this.tasksRepository.find({
      where: { shiftId },
      order: { priority: 'DESC', createdAt: 'ASC' },
    });
  }
}
