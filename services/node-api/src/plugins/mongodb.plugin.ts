import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import fastifyMongodb from '@fastify/mongodb';
import { databaseConfig } from '../config/database';

async function mongodbPluginFn(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  await fastify.register(fastifyMongodb, {
    url: databaseConfig.mongodb.url,
    database: databaseConfig.mongodb.database,
  });

  fastify.log.info('MongoDB connected');

  fastify.addHook('onClose', async (instance) => {
    if (instance.mongo.client) {
      await instance.mongo.client.close();
      fastify.log.info('MongoDB connection closed');
    }
  });
}

export const mongodbPlugin = fastifyPlugin(mongodbPluginFn);
