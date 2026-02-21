import { Client } from 'pg';
import { databaseConfig } from '../config/database';

export async function initializePostgresDatabase() {
  const client = new Client({
    host: databaseConfig.postgres.host,
    port: databaseConfig.postgres.port,
    database: databaseConfig.postgres.database,
    user: databaseConfig.postgres.user,
    password: databaseConfig.postgres.password,
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL for initialization');

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Users table created or already exists');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `);
    console.log('✓ Email index created or already exists');

    const { rows } = await client.query('SELECT COUNT(*) FROM users');
    if (parseInt(rows[0].count) === 0) {
      await client.query(`
        INSERT INTO users (name, email) VALUES
        ('John Doe', 'john@example.com'),
        ('Jane Smith', 'jane@example.com'),
        ('Bob Johnson', 'bob@example.com')
      `);
      console.log('✓ Sample users inserted');
    } else {
      console.log(`✓ Database already has ${rows[0].count} users`);
    }

    console.log('PostgreSQL database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing PostgreSQL database:', error);
    throw error;
  } finally {
    await client.end();
  }
}
