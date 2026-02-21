import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export async function apiController(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.get('/ping', async (request, reply) => {
    return {
      message: 'pong',
      timestamp: new Date().toISOString(),
    };
  });

  fastify.get('/info', async (request, reply) => {
    return {
      service: 'node-api',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
    };
  });
}
