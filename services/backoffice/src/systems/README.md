# Systems Module

Управління системами (категоріями) для організації shifts та tasks.

## Що таке System?

**System** — це окрема категорія або потік контенту, для якого працюють воркери:
- Football Stream 1
- Basketball Stream A
- Tennis Court 2
- News Feed System
- etc.

## Ієрархія

```
System
  ↓ has many
Shift (worker працює на системі в певний час)
  ↓ has many
Task (завдання для обробки контенту системи)
  ↓ processes
Event (медіа контент)
```

## Entity

```typescript
@Entity({ name: 'systems' })
export class SystemEntity {
  id: string;              // UUID
  name: string;            // Унікальна назва
  description?: string;    // Опис системи
  isActive: boolean;       // Чи активна система
  shifts: ShiftEntity[];   // Зміни для цієї системи
  tasks: TaskEntity[];     // Tasks для цієї системи
  createdAt: Date;
  updatedAt: Date;
}
```

## API Endpoints

### Create System (Admin)
```http
POST /systems
Content-Type: application/json
Authorization: Bearer {admin_token}

{
  "name": "Football Stream 1",
  "description": "Main football streaming system"
}
```

### Get All Systems
```http
GET /systems
Authorization: Bearer {token}

Response: [
  {
    "id": "uuid",
    "name": "Football Stream 1",
    "description": "Main football streaming system",
    "isActive": true,
    "createdAt": "2026-02-22T10:00:00Z",
    "updatedAt": "2026-02-22T10:00:00Z"
  }
]
```

### Get System by ID
```http
GET /systems/:id
Authorization: Bearer {token}
```

### Update System (Admin)
```http
PATCH /systems/:id
Content-Type: application/json
Authorization: Bearer {admin_token}

{
  "name": "Football Stream 1 Updated",
  "description": "New description",
  "isActive": false
}
```

### Delete System (Admin)
```http
DELETE /systems/:id
Authorization: Bearer {admin_token}
```

## Service Methods

```typescript
// Створити систему
await systemsService.create(name, description?);

// Отримати всі системи
await systemsService.findAll();

// Отримати систему за ID
await systemsService.findOne(id);

// Знайти систему за назвою
await systemsService.findByName(name);

// Оновити систему
await systemsService.update(id, { name?, description?, isActive? });

// Видалити систему
await systemsService.delete(id);
```

## Usage Example

```typescript
// 1. Admin створює систему
const system = await systemsService.create(
  'Football Stream 1',
  'Main football streaming system'
);

// 2. Admin створює shift для цієї системи
const shift = await shiftsService.create(
  system.id,
  new Date('2026-02-22T09:00:00Z'),
  new Date('2026-02-22T17:00:00Z')
);

// 3. System створює tasks для цієї системи
const task = await tasksService.createTask(
  shift.id,
  system.id,  // ← обов'язково
  TaskEntityType.EVENT_VIDEO,
  eventId,
  priority
);

// 4. Worker працює на shift і отримує tasks для системи
const myShift = await shiftsService.getUserShift(workerId);
const nextTask = await tasksService.getNextTaskForWorker(
  workerId, 
  myShift.id
);
```

## Database Relations

```sql
-- System має багато Shifts
systems (1) ──→ (N) shifts

-- System має багато Tasks
systems (1) ──→ (N) tasks

-- Foreign Keys
ALTER TABLE shifts 
  ADD CONSTRAINT fk_shifts_system_id 
  FOREIGN KEY (system_id) REFERENCES systems(id) 
  ON DELETE RESTRICT;

ALTER TABLE tasks 
  ADD CONSTRAINT fk_tasks_system_id 
  FOREIGN KEY (system_id) REFERENCES systems(id) 
  ON DELETE RESTRICT;
```

## Indexes

```sql
-- Швидкий пошук по назві
CREATE INDEX idx_systems_name ON systems (name);

-- Швидкий пошук tasks по системі + статусу
CREATE INDEX idx_tasks_system_status ON tasks (system_id, status);
```

## Common Queries

### Отримати всі активні системи
```typescript
const systems = await systemsRepository.find({
  where: { isActive: true },
  order: { name: 'ASC' }
});
```

### Отримати всі shifts для системи
```typescript
const shifts = await shiftsRepository.find({
  where: { systemId: systemId },
  relations: ['userShifts', 'system']
});
```

### Отримати всі pending tasks для системи
```typescript
const tasks = await tasksRepository.find({
  where: { 
    systemId: systemId,
    status: TaskStatus.PENDING 
  },
  order: { priority: 'DESC', createdAt: 'ASC' }
});
```

### Статистика по системі
```typescript
const stats = await tasksRepository
  .createQueryBuilder('task')
  .select('task.status', 'status')
  .addSelect('COUNT(*)', 'count')
  .where('task.systemId = :systemId', { systemId })
  .groupBy('task.status')
  .getRawMany();
```

## Validation Rules

- ✅ `name` - обов'язкове, унікальне
- ✅ `description` - опційне
- ✅ `isActive` - default `true`
- ⚠️ Не можна видалити систему якщо є активні shifts або tasks

## Future Enhancements

1. **System Settings** - JSON конфіг для кожної системи
2. **System Health** - моніторинг стану системи
3. **System Metrics** - метрики продуктивності
4. **System Categories** - групування систем по типах
5. **System Permissions** - права доступу per system
