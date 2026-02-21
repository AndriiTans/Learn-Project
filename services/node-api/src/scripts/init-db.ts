import { Client } from 'pg';
import { databaseConfig } from '../config/database';

async function initializeDatabase() {
  const client = new Client({
    host: databaseConfig.postgres.host,
    port: databaseConfig.postgres.port,
    database: databaseConfig.postgres.database,
    user: databaseConfig.postgres.user,
    password: databaseConfig.postgres.password,
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table created or already exists');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `);
    console.log('Email index created or already exists');

    const { rows } = await client.query('SELECT COUNT(*) FROM users');
    if (parseInt(rows[0].count) === 0) {
      await client.query(`
        INSERT INTO users (name, email) VALUES
        ('John Doe', 'john@example.com'),
        ('Jane Smith', 'jane@example.com')
      `);
      console.log('Sample users inserted');
    }

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

initializeDatabase();
