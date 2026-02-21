import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import fastifyPostgres from '@fastify/postgres';
import { databaseConfig } from '../config/database';

async function postgresPluginFn(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  await fastify.register(fastifyPostgres, {
    host: databaseConfig.postgres.host,
    port: databaseConfig.postgres.port,
    database: databaseConfig.postgres.database,
    user: databaseConfig.postgres.user,
    password: databaseConfig.postgres.password,
  });

  fastify.log.info('PostgreSQL connected');

  fastify.addHook('onClose', async (instance) => {
    await instance.pg.pool.end();
    fastify.log.info('PostgreSQL connection closed');
  });
}

export const postgresPlugin = fastifyPlugin(postgresPluginFn);
