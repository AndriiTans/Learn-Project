import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateEventMediaTables20260221120000 implements MigrationInterface {
  name = 'CreateEventMediaTables20260221120000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"')

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "events" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "system_id" uuid NOT NULL,
        "started_at" TIMESTAMPTZ NOT NULL,
        "ended_at" TIMESTAMPTZ,
        "event_type" character varying,
        "meta" jsonb,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_events_id" PRIMARY KEY ("id")
      )
    `)

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_events_system_started_at"
      ON "events" ("system_id", "started_at")
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "event_videos" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "event_id" uuid NOT NULL,
        "storage_key" character varying NOT NULL,
        "thumbnail_key" character varying,
        "duration_ms" integer,
        "mime_type" character varying NOT NULL,
        "size_bytes" bigint NOT NULL,
        "captured_at" TIMESTAMPTZ NOT NULL,
        "meta" jsonb,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_event_videos_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_event_videos_event_id"
          FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE
      )
    `)

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_event_videos_event_captured_at"
      ON "event_videos" ("event_id", "captured_at")
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "event_images" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "event_id" uuid NOT NULL,
        "storage_key" character varying NOT NULL,
        "width" integer,
        "height" integer,
        "mime_type" character varying NOT NULL,
        "size_bytes" bigint NOT NULL,
        "captured_at" TIMESTAMPTZ NOT NULL,
        "meta" jsonb,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_event_images_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_event_images_event_id"
          FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE
      )
    `)

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_event_images_event_captured_at"
      ON "event_images" ("event_id", "captured_at")
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX IF EXISTS "idx_event_images_event_captured_at"')
    await queryRunner.query('DROP TABLE IF EXISTS "event_images"')

    await queryRunner.query('DROP INDEX IF EXISTS "idx_event_videos_event_captured_at"')
    await queryRunner.query('DROP TABLE IF EXISTS "event_videos"')

    await queryRunner.query('DROP INDEX IF EXISTS "idx_events_system_started_at"')
    await queryRunner.query('DROP TABLE IF EXISTS "events"')
  }
}
