import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemEntity } from './entities/system.entity';

@Injectable()
export class SystemsService {
  constructor(
    @InjectRepository(SystemEntity)
    private readonly systemsRepository: Repository<SystemEntity>,
  ) {}

  async create(name: string, description?: string): Promise<SystemEntity> {
    const system = this.systemsRepository.create({
      name,
      description,
      isActive: true,
    });

    return this.systemsRepository.save(system);
  }

  async findAll(): Promise<SystemEntity[]> {
    return this.systemsRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<SystemEntity> {
    const system = await this.systemsRepository.findOne({
      where: { id },
    });

    if (!system) {
      throw new NotFoundException('System not found');
    }

    return system;
  }

  async findByName(name: string): Promise<SystemEntity | null> {
    return this.systemsRepository.findOne({
      where: { name },
    });
  }

  async update(
    id: string,
    updates: Partial<Pick<SystemEntity, 'name' | 'description' | 'isActive'>>,
  ): Promise<SystemEntity> {
    const system = await this.findOne(id);
    Object.assign(system, updates);
    return this.systemsRepository.save(system);
  }

  async delete(id: string): Promise<void> {
    const system = await this.findOne(id);
    await this.systemsRepository.remove(system);
  }
}
