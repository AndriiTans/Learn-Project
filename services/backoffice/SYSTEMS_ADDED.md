# Systems Module Added

## ✅ Що додано

### Нова структура:

```
System (football, basketball, tennis)
  ↓
Shift (працівник працює з системою в певний час)
  ↓
Task (обробити event для системи через shift)
  ↓
Event (медіа контент для системи)
```

### Створені файли:

**Systems Module:**
- `src/systems/entities/system.entity.ts` - System entity
- `src/systems/systems.service.ts` - CRUD операції для systems
- `src/systems/systems.controller.ts` - REST API endpoints
- `src/systems/systems.module.ts` - NestJS module

**Migrations:**
- `src/database/migrations/20260222010000-create-systems-table.ts` - створює systems таблицю + FK в shifts
- `src/database/migrations/20260222020000-add-system-to-tasks.ts` - додає system_id в tasks

### Оновлені файли:

**Entities:**
- ✅ `task.entity.ts` - додано `systemId` + `@ManyToOne(() => SystemEntity)`
- ✅ `shift.entity.ts` - додано `@ManyToOne(() => SystemEntity)`

**DTOs:**
- ✅ `create-task.dto.ts` - додано `systemId: string` поле

**Services:**
- ✅ `tasks.service.ts` - `createTask()` тепер приймає `systemId`

**Controllers:**
- ✅ `tasks.controller.ts` - передає `dto.systemId` в service

**Modules:**
- ✅ `app.module.ts` - додано `SystemsModule`
- ✅ `typeorm.datasource.ts` - додано `SystemEntity`

## 📊 Database Schema

### Systems Table

```sql
CREATE TABLE systems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_systems_name ON systems (name);
```

### Updated Tables

**shifts:**
```sql
ALTER TABLE shifts 
  ADD CONSTRAINT fk_shifts_system 
  FOREIGN KEY (system_id) REFERENCES systems(id) 
  ON DELETE RESTRICT;
```

**tasks:**
```sql
ALTER TABLE tasks 
  ADD COLUMN system_id UUID NOT NULL;

ALTER TABLE tasks 
  ADD CONSTRAINT fk_tasks_system 
  FOREIGN KEY (system_id) REFERENCES systems(id) 
  ON DELETE RESTRICT;

CREATE INDEX idx_tasks_system_status ON tasks (system_id, status);
```

## 🔌 API Endpoints

### Systems Management (Admin only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/systems` | Створити нову систему |
| GET | `/systems` | Отримати всі системи |
| GET | `/systems/:id` | Отримати систему за ID |
| PATCH | `/systems/:id` | Оновити систему |
| DELETE | `/systems/:id` | Видалити систему |

### Examples:

**Create System:**
```http
POST /systems
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Football Stream 1",
  "description": "Main football streaming system"
}
```

**Get All Systems:**
```http
GET /systems
Authorization: Bearer {token}
```

**Create Task (updated):**
```http
POST /tasks
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "shiftId": "uuid",
  "systemId": "uuid",  // ⬅️ NEW FIELD
  "entityType": "event_video",
  "entityId": "uuid",
  "priority": 5
}
```

## 🎯 Relations

```
SystemEntity (1) ──→ (N) ShiftEntity
SystemEntity (1) ──→ (N) TaskEntity
SystemEntity (1) ──→ (N) EventEntity (через shift)
```

### TypeORM Relations:

```typescript
// SystemEntity
@OneToMany(() => ShiftEntity, (shift) => shift.system)
shifts: ShiftEntity[];

@OneToMany(() => TaskEntity, (task) => task.system)
tasks: TaskEntity[];

// ShiftEntity
@ManyToOne(() => SystemEntity)
@JoinColumn({ name: 'system_id' })
system: SystemEntity;

// TaskEntity
@ManyToOne(() => SystemEntity)
@JoinColumn({ name: 'system_id' })
system: SystemEntity;
```

## 🚀 Usage Examples

### Create System & Tasks Flow:

```typescript
// 1. Admin створює систему
const system = await systemsService.create('Football Stream 1', 'Main football system');

// 2. Admin створює shift для системи
const shift = await shiftsService.create(system.id, startDate, endDate);

// 3. Worker отримує shift assignment
await shiftsService.assignUserToShift(shift.id, workerId);

// 4. System автоматично створює tasks для shift + system
const task = await tasksService.createTask(
  shift.id,
  system.id,  // ⬅️ тепер обов'язково
  TaskEntityType.EVENT_VIDEO,
  eventVideoId,
  priority
);

// 5. Worker бере task зі свого shift (автоматично фільтрується по system)
const nextTask = await tasksService.getNextTaskForWorker(workerId, shift.id);
```

### Query Tasks by System:

```typescript
// Можна легко знайти всі tasks для конкретної системи
const tasks = await tasksRepository.find({
  where: { systemId: 'uuid', status: TaskStatus.PENDING },
  order: { priority: 'DESC', createdAt: 'ASC' }
});
```

## 📈 Indexes

Додано новий індекс для швидкого query tasks по системі:

```sql
idx_tasks_system_status (system_id, status)
```

Це прискорює запити типу:
- "дай всі pending tasks для системи X"
- "скільки tasks в progress для системи Y"
- "знайди failed tasks для системи Z"

## ⚠️ Migration Notes

**Важливо:** Перед запуском міграцій переконайтесь, що:
1. В БД вже є записи в `shifts` з `system_id`
2. Створіть відповідні системи ДО запуску міграції `20260222010000`
3. Або спочатку створіть системи, потім оновіть `shifts.system_id`

**Послідовність:**

```bash
# 1. Запустити міграції для створення systems
npm run migration:run

# 2. Створити системи через API або вручну
INSERT INTO systems (id, name, description) 
VALUES ('uuid-1', 'System 1', 'Description');

# 3. Оновити існуючі shifts (якщо треба)
UPDATE shifts SET system_id = 'uuid-1' WHERE system_id IS NULL;

# 4. Створити нові shifts з правильним system_id
```

## ✅ Validation

- ✅ Build успішний
- ✅ No linter errors
- ✅ TypeORM relations налаштовані
- ✅ Міграції створені
- ✅ API endpoints готові
- ✅ Indexes додані

## 🔮 Future Enhancements

1. **System Settings** - конфіг для кожної системи (thresholds, rules)
2. **System Analytics** - метрики по системах (tasks completed, avg time)
3. **System Health Monitoring** - статус системи (online/offline/degraded)
4. **Multi-System Tasks** (M:N) - якщо task має бути для кількох систем одночасно
5. **System Categories** - групування систем (Sport, News, Entertainment)

## 📝 Summary

Тепер у вас є повноцінна **3-рівнева ієрархія**:

```
System → Shift → Task
```

Це дозволяє:
- ✅ Фільтрувати tasks по системі без join через shift
- ✅ Аналізувати продуктивність по системах
- ✅ Швидко знаходити всі tasks для конкретної системи
- ✅ Легко масштабувати (додавати нові системи)
- ✅ Гнучко управляти правами доступу (per system)
