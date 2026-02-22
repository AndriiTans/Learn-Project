import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import type { JWTPayload } from 'jose';
import { CompleteTaskDto } from './dto/complete-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './enums/task-status.enum';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles('admin')
  async createTask(@Body() dto: CreateTaskDto) {
    return this.tasksService.createTask(
      dto.shiftId,
      dto.systemId,
      dto.entityType,
      dto.entityId,
      dto.priority,
      dto.subType,
    );
  }

  @Get('next')
  async getNextTask(
    @CurrentUser() user: JWTPayload,
    @Query('shiftId') shiftId: string,
  ) {
    const userId = user.sub as string;
    return this.tasksService.getNextTaskForWorker(userId, shiftId);
  }

  @Put(':id/start')
  async startTask(@Param('id') id: string, @CurrentUser() user: JWTPayload) {
    const userId = user.sub as string;
    return this.tasksService.startTask(id, userId);
  }

  @Put(':id/complete')
  async completeTask(
    @Param('id') id: string,
    @CurrentUser() user: JWTPayload,
    @Body() dto: CompleteTaskDto,
  ) {
    const userId = user.sub as string;
    return this.tasksService.completeTask(id, userId, dto.comment);
  }

  @Put(':id/fail')
  async failTask(
    @Param('id') id: string,
    @CurrentUser() user: JWTPayload,
    @Body() dto: CompleteTaskDto,
  ) {
    const userId = user.sub as string;
    return this.tasksService.failTask(id, userId, dto.comment);
  }

  @Get('my')
  async getMyTasks(
    @CurrentUser() user: JWTPayload,
    @Query('status') status?: TaskStatus,
  ) {
    const userId = user.sub as string;
    return this.tasksService.getMyTasks(userId, status);
  }

  @Get('shift/:shiftId')
  @Roles('admin')
  async getTasksByShift(@Param('shiftId') shiftId: string) {
    return this.tasksService.getTasksByShift(shiftId);
  }
}
