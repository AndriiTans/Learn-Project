import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { AuthUserEntity } from '../auth/entities/auth-user.entity'
import { EventEntity } from '../events/entities/event.entity'
import { EventImageEntity } from '../events/entities/event-image.entity'
import { EventVideoEntity } from '../events/entities/event-video.entity'
import { ShiftEntity } from '../shifts/entities/shift.entity'
import { UserShiftEntity } from '../shifts/entities/user-shift.entity'
import { SystemEntity } from '../systems/entities/system.entity'
import { TaskEntity } from '../tasks/entities/task.entity'

const getEnvOrThrow = (name: string): string => {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

export default new DataSource({
  type: 'postgres',
  host: getEnvOrThrow('POSTGRES_HOST'),
  port: Number(getEnvOrThrow('POSTGRES_PORT')),
  username: getEnvOrThrow('POSTGRES_USER'),
  password: getEnvOrThrow('POSTGRES_PASSWORD'),
  database: getEnvOrThrow('POSTGRES_DB'),
  entities: [
    AuthUserEntity,
    EventEntity,
    EventVideoEntity,
    EventImageEntity,
    ShiftEntity,
    UserShiftEntity,
    SystemEntity,
    TaskEntity,
  ],
  migrations: ['src/database/migrations/*.ts'],
})
