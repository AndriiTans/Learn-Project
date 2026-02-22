import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { SystemsService } from './systems.service';

@Controller('systems')
export class SystemsController {
  constructor(private readonly systemsService: SystemsService) {}

  @Post()
  @Roles('admin')
  async create(
    @Body('name') name: string,
    @Body('description') description?: string,
  ) {
    return this.systemsService.create(name, description);
  }

  @Get()
  async findAll() {
    return this.systemsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.systemsService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() updates: { name?: string; description?: string; isActive?: boolean },
  ) {
    return this.systemsService.update(id, updates);
  }

  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id') id: string) {
    await this.systemsService.delete(id);
    return { message: 'System deleted successfully' };
  }
}
