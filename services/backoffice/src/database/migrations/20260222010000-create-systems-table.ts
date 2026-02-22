import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateSystemsTable20260222010000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'systems',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
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

    await queryRunner.query(`
      CREATE INDEX idx_systems_name ON systems (name);
    `);

    await queryRunner.createForeignKey(
      'shifts',
      new TableForeignKey({
        columnNames: ['system_id'],
        referencedTableName: 'systems',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const shiftsTable = await queryRunner.getTable('shifts');
    if (shiftsTable) {
      const foreignKey = shiftsTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('system_id') !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('shifts', foreignKey);
      }
    }

    await queryRunner.query(`DROP INDEX IF EXISTS idx_systems_name;`);
    await queryRunner.dropTable('systems', true);
  }
}
