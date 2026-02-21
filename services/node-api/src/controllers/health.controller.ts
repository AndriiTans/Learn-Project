import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export async function healthController(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.get('/health', async (request, reply) => {
    const health: any = {
      service: 'node-api',
      status: 'healthy',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      databases: {
        postgres: 'unknown',
        mongodb: 'unknown',
      },
    };

    try {
      const client = await fastify.pg.connect();
      await client.query('SELECT 1');
      client.release();
      health.databases.postgres = 'connected';
    } catch (error) {
      health.databases.postgres = 'disconnected';
      health.status = 'degraded';
    }

    try {
      if (fastify.mongo.db) {
        await fastify.mongo.db.admin().ping();
        health.databases.mongodb = 'connected';
      } else {
        health.databases.mongodb = 'disconnected';
        health.status = 'degraded';
      }
    } catch (error) {
      health.databases.mongodb = 'disconnected';
      health.status = 'degraded';
    }

    return health;
  });
}
