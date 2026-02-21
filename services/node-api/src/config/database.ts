export const databaseConfig = {
  postgres: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: Number(process.env.POSTGRES_PORT) || 5432,
    database: process.env.POSTGRES_DB || 'learn_project',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
  },
  mongodb: {
    url: process.env.MONGODB_URL || 'mongodb://localhost:27017',
    database: process.env.MONGODB_DB || 'learn_project',
  },
};
