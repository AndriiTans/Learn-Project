import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { TaskEntityType } from '../enums/task-entity-type.enum';

export class CreateTaskDto {
  @IsUUID()
  shiftId: string;

  @IsUUID()
  systemId: string;

  @IsEnum(TaskEntityType)
  entityType: TaskEntityType;

  @IsUUID()
  entityId: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  priority?: number;

  @IsOptional()
  @IsString()
  subType?: string;
}

