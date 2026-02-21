import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from 'fastify';

interface CreateUserBody {
  name: string;
  email: string;
}

interface UserParams {
  id: string;
}

export async function usersController(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.get('/', async (request, reply) => {
    try {
      const client = await fastify.pg.connect();
      try {
        const { rows } = await client.query('SELECT * FROM users ORDER BY id');
        return { users: rows };
      } finally {
        client.release();
      }
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch users from PostgreSQL' });
    }
  });

  fastify.get<{ Params: UserParams }>('/:id', async (request, reply) => {
    const { id } = request.params;
    
    try {
      const client = await fastify.pg.connect();
      try {
        const { rows } = await client.query('SELECT * FROM users WHERE id = $1', [id]);
        if (rows.length === 0) {
          return reply.status(404).send({ error: 'User not found' });
        }
        return { user: rows[0] };
      } finally {
        client.release();
      }
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch user from PostgreSQL' });
    }
  });

  fastify.post<{ Body: CreateUserBody }>('/', async (request, reply) => {
    const { name, email } = request.body;

    if (!name || !email) {
      return reply.status(400).send({ error: 'Name and email are required' });
    }

    try {
      const client = await fastify.pg.connect();
      try {
        const { rows } = await client.query(
          'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
          [name, email]
        );
        return reply.status(201).send({ user: rows[0] });
      } finally {
        client.release();
      }
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to create user in PostgreSQL' });
    }
  });

  fastify.get('/logs/activity', async (request, reply) => {
    try {
      const collection = fastify.mongo.db?.collection('activity_logs');
      if (!collection) {
        return reply.status(500).send({ error: 'MongoDB collection not available' });
      }

      const logs = await collection
        .find({})
        .sort({ timestamp: -1 })
        .limit(100)
        .toArray();

      return { logs };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch logs from MongoDB' });
    }
  });

  fastify.post('/logs/activity', async (request, reply) => {
    const { action, userId, metadata } = request.body as {
      action: string;
      userId?: string;
      metadata?: Record<string, any>;
    };

    if (!action) {
      return reply.status(400).send({ error: 'Action is required' });
    }

    try {
      const collection = fastify.mongo.db?.collection('activity_logs');
      if (!collection) {
        return reply.status(500).send({ error: 'MongoDB collection not available' });
      }

      const log = {
        action,
        userId,
        metadata,
        timestamp: new Date(),
      };

      const result = await collection.insertOne(log);
      return reply.status(201).send({ 
        log: { ...log, _id: result.insertedId } 
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to create log in MongoDB' });
    }
  });
}
