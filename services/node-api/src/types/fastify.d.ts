import { FastifyInstance } from 'fastify';
import { Pool, PoolClient } from 'pg';
import { Db, MongoClient } from 'mongodb';

declare module 'fastify' {
  interface FastifyInstance {
    pg: {
      pool: Pool;
      connect: () => Promise<PoolClient>;
      query: (text: string, values?: any[]) => Promise<any>;
    };
    mongo: {
      client: MongoClient;
      db?: Db;
    };
  }
}
