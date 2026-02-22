# Tasks Module

Black-box task queue система для управління завданнями працівників (workers).

## Архітектура

```
Task → Shift → System
       ↓
     Worker (User)
```

### Основна логіка

- **Task** прив'язаний до конкретного **Shift**
- **Worker** (користувач) працює на конкретній зміні (Shift)
- Worker бере tasks для свого Shift за пріоритетом (priority DESC, created_at ASC)

## Entity Types

Task може бути для різних типів сутностей:

- `event` - загальне event завдання
- `event_video` - обробка відео
- `event_image` - обробка зображення

## Task Statuses

```
pending → assigned → in_progress → completed
                                 ↘ failed
                                 ↘ cancelled
```

- **pending** - task створений, чекає на worker'а
- **assigned** - task призначений worker'у
- **in_progress** - worker почав виконання
- **completed** - task успішно виконаний
- **failed** - task завершився з помилкою
- **cancelled** - task скасований

## API Endpoints

### 1. Отримати наступний task для worker'а

```http
GET /tasks/next?shiftId={shiftId}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "uuid",
  "shiftId": "uuid",
  "entityType": "event_video",
  "entityId": "uuid",
  "status": "assigned",
  "priority": 5,
  "workerId": "uuid",
  "startedAt": "2026-02-22T10:00:00Z",
  "createdAt": "2026-02-22T09:00:00Z"
}
```

### 2. Почати виконання task

```http
PUT /tasks/:id/start
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "uuid",
  "status": "in_progress",
  "startedAt": "2026-02-22T10:05:00Z"
}
```

### 3. Завершити task (успішно)

```http
PUT /tasks/:id/complete
Authorization: Bearer {token}
Content-Type: application/json

{
  "comment": "Optional worker comment"
}
```

### 4. Завершити task (з помилкою)

```http
PUT /tasks/:id/fail
Authorization: Bearer {token}
Content-Type: application/json

{
  "comment": "Error description"
}
```

### 5. Отримати мої tasks

```http
GET /tasks/my?status=in_progress
Authorization: Bearer {token}
```

**Query params:**
- `status` (optional) - фільтр по статусу

### 6. Отримати tasks для shift (admin)

```http
GET /tasks/shift/:shiftId
Authorization: Bearer {token}
```

## Database Schema

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shift_id UUID NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
  entity_type ENUM('event', 'event_video', 'event_image') NOT NULL,
  entity_id UUID NOT NULL,
  status ENUM('pending', 'assigned', 'in_progress', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
  priority INT DEFAULT 0,
  worker_id UUID REFERENCES auth_users(id) ON DELETE SET NULL,
  sub_type VARCHAR,
  worker_comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tasks_shift_status ON tasks (shift_id, status);
CREATE INDEX idx_tasks_worker_status ON tasks (worker_id, status);
CREATE INDEX idx_tasks_shift_priority_created ON tasks (shift_id, priority DESC, created_at ASC);
```

## Usage Example

### Worker flow:

```typescript
// 1. Worker login і отримує свій shift_id
const shiftId = 'my-shift-uuid';

// 2. Отримати наступний task
const task = await fetch('/tasks/next?shiftId=' + shiftId);

// 3. Почати роботу
await fetch(`/tasks/${task.id}/start`, { method: 'PUT' });

// 4. Виконати роботу (обробити відео/імейдж)
await processTask(task);

// 5. Завершити task
await fetch(`/tasks/${task.id}/complete`, {
  method: 'PUT',
  body: JSON.stringify({ comment: 'Done!' })
});
```

## Service Methods

```typescript
// Створити новий task
await tasksService.createTask(
  shiftId,
  TaskEntityType.EVENT_VIDEO,
  entityId,
  priority, // опційно, default = 0
  subType   // опційно
);

// Отримати наступний task для worker'а
const task = await tasksService.getNextTaskForWorker(workerId, shiftId);

// Почати task
await tasksService.startTask(taskId, workerId);

// Завершити task
await tasksService.completeTask(taskId, workerId, comment?);

// Завершити з помилкою
await tasksService.failTask(taskId, workerId, comment?);

// Отримати tasks worker'а
const myTasks = await tasksService.getMyTasks(workerId, status?);

// Отримати tasks для shift
const shiftTasks = await tasksService.getTasksByShift(shiftId);
```

## Future Enhancements

1. **Task TTL** - автоматичне скасування старих pending tasks
2. **Task Reassignment** - автоматичне повернення task в pending якщо worker не завершив вчасно
3. **Task Groups** - групування tasks (як GroupId у ZoomInCloud)
4. **Task Context** - додатковий контекст для task (system, game video, etc.)
5. **Worker Dispatch Rules** - правила розподілу tasks на основі worker skills
6. **Priority Calculation** - динамічний розрахунок пріоритету

## Порівняння з ZoomInCloud

| Аспект | ZoomInCloud | Learn-Project |
|--------|-------------|---------------|
| Task → System | M:N через `TaskToSystem` | 1:1 через `Shift` |
| ID типи | int | uuid |
| ORM | raw SQL | TypeORM |
| Worker assignment | manual + dispatch rules | simple queue |
| Task Groups | є (`GroupId`) | немає (поки) |
