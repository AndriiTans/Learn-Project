import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTasksTable20260222000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tasks',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'shift_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'entity_type',
            type: 'enum',
            enum: ['event', 'event_video', 'event_image'],
            isNullable: false,
          },
          {
            name: 'entity_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['pending', 'assigned', 'in_progress', 'completed', 'failed', 'cancelled'],
            default: "'pending'",
            isNullable: false,
          },
          {
            name: 'priority',
            type: 'int',
            default: 0,
            isNullable: false,
          },
          {
            name: 'worker_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'sub_type',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'worker_comment',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'started_at',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'completed_at',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'tasks',
      new TableForeignKey({
        columnNames: ['shift_id'],
        referencedTableName: 'shifts',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'tasks',
      new TableForeignKey({
        columnNames: ['worker_id'],
        referencedTableName: 'auth_users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.query(`
      CREATE INDEX idx_tasks_shift_status ON tasks (shift_id, status);
      CREATE INDEX idx_tasks_worker_status ON tasks (worker_id, status);
      CREATE INDEX idx_tasks_shift_priority_created ON tasks (shift_id, priority DESC, created_at ASC);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_tasks_shift_priority_created;
      DROP INDEX IF EXISTS idx_tasks_worker_status;
      DROP INDEX IF EXISTS idx_tasks_shift_status;
    `);

    const table = await queryRunner.getTable('tasks');
    if (table) {
      const shiftForeignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('shift_id') !== -1,
      );
      const workerForeignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('worker_id') !== -1,
      );

      if (shiftForeignKey) {
        await queryRunner.dropForeignKey('tasks', shiftForeignKey);
      }
      if (workerForeignKey) {
        await queryRunner.dropForeignKey('tasks', workerForeignKey);
      }
    }

    await queryRunner.dropTable('tasks', true);
  }
}
