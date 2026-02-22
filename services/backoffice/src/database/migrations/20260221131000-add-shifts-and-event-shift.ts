import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddShiftsAndEventShift20260221131000 implements MigrationInterface {
  name = 'AddShiftsAndEventShift20260221131000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "shifts" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "system_id" uuid NOT NULL,
        "started_at" TIMESTAMPTZ NOT NULL,
        "ended_at" TIMESTAMPTZ NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_shifts_id" PRIMARY KEY ("id")
      )
    `)

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_shifts_system_started_at"
      ON "shifts" ("system_id", "started_at")
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users_shifts" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "shift_id" uuid NOT NULL,
        "assigned_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users_shifts_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_users_shifts_user_id"
          FOREIGN KEY ("user_id") REFERENCES "auth_users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_users_shifts_shift_id"
          FOREIGN KEY ("shift_id") REFERENCES "shifts"("id") ON DELETE CASCADE
      )
    `)

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "idx_users_shifts_user_shift_unique"
      ON "users_shifts" ("user_id", "shift_id")
    `)

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_users_shifts_shift_id"
      ON "users_shifts" ("shift_id")
    `)

    await queryRunner.query(`
      ALTER TABLE "events"
      ADD COLUMN IF NOT EXISTS "shift_id" uuid
    `)

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_events_shift_started_at"
      ON "events" ("shift_id", "started_at")
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'FK_events_shift_id'
        ) THEN
          ALTER TABLE "events"
          ADD CONSTRAINT "FK_events_shift_id"
          FOREIGN KEY ("shift_id") REFERENCES "shifts"("id") ON DELETE SET NULL;
        END IF;
      END
      $$;
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "events"
      DROP CONSTRAINT IF EXISTS "FK_events_shift_id"
    `)
    await queryRunner.query('DROP INDEX IF EXISTS "idx_events_shift_started_at"')
    await queryRunner.query(`
      ALTER TABLE "events"
      DROP COLUMN IF EXISTS "shift_id"
    `)

    await queryRunner.query('DROP INDEX IF EXISTS "idx_users_shifts_shift_id"')
    await queryRunner.query('DROP INDEX IF EXISTS "idx_users_shifts_user_shift_unique"')
    await queryRunner.query('DROP TABLE IF EXISTS "users_shifts"')

    await queryRunner.query('DROP INDEX IF EXISTS "idx_shifts_system_started_at"')
    await queryRunner.query('DROP TABLE IF EXISTS "shifts"')
  }
}
