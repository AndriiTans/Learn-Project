import Fastify from 'fastify';
import cors from '@fastify/cors';
import { postgresPlugin } from './plugins/postgres.plugin';
import { mongodbPlugin } from './plugins/mongodb.plugin';
import { healthController } from './controllers/health.controller';
import { apiController } from './controllers/api.controller';
import { usersController } from './controllers/users.controller';
import { initializePostgresDatabase } from './utils/db-init';

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
});

const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || '0.0.0.0';

async function start() {
  try {
    // Register CORS first
    await fastify.register(cors, {
      origin: true,
    });

    // Register database plugins
    await fastify.register(postgresPlugin);
    await fastify.register(mongodbPlugin);

    // Register all routes BEFORE starting the server
    fastify.get('/', async (request, reply) => {
      return {
        service: 'node-api',
        status: 'ok',
        docs: {
          health: '/health',
          ping: '/api/ping',
          users: '/api/users',
        },
      };
    });

    await fastify.register(healthController);
    await fastify.register(apiController, { prefix: '/api' });
    await fastify.register(usersController, { prefix: '/api/users' });

    // Wait for all plugins to be ready
    await fastify.ready();

    // Initialize database after plugins are ready
    await initializePostgresDatabase();

    // Start listening
    await fastify.listen({ port, host });
    console.log(`node-api listening on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
