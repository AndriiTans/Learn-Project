import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddSystemToTasks20260222020000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'tasks',
      new TableColumn({
        name: 'system_id',
        type: 'uuid',
        isNullable: false,
      }),
    );

    await queryRunner.createForeignKey(
      'tasks',
      new TableForeignKey({
        columnNames: ['system_id'],
        referencedTableName: 'systems',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.query(`
      CREATE INDEX idx_tasks_system_status ON tasks (system_id, status);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_tasks_system_status;`);

    const table = await queryRunner.getTable('tasks');
    if (table) {
      const foreignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('system_id') !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('tasks', foreignKey);
      }
    }

    await queryRunner.dropColumn('tasks', 'system_id');
  }
}
