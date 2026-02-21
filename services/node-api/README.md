# Node API Service

A Fastify-based API service with PostgreSQL and MongoDB integration, built with TypeScript.

## Features

- **Fastify** - Fast and low overhead web framework
- **TypeScript** - Type-safe development
- **PostgreSQL** - Relational database for structured data
- **MongoDB** - NoSQL database for flexible documents
- **CORS** - Cross-Origin Resource Sharing enabled
- **Logging** - Built-in request logging
- **Health Checks** - Database connection monitoring

## Prerequisites

- Node.js >= 20
- Docker and Docker Compose (recommended)
- PostgreSQL (if running without Docker)
- MongoDB (if running without Docker)

## Quick Start with Docker

### Option 1: Run databases only (for local development)

```bash
# Start PostgreSQL and MongoDB in Docker
docker-compose -f docker-compose.local.yml up -d

# Install dependencies
npm install

# Run the API locally with hot reload
npm run dev
```

### Option 2: Run everything in Docker (development mode)

From the project root:

```bash
# Start all services in development mode
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f node-api
```

### Option 3: Run everything in Docker (production mode)

From the project root:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f node-api
```

## Local Development Setup

### Installation

```bash
npm install
```

### Configuration

Copy `.env.example` to `.env` and configure your environment variables:

```bash
cp .env.example .env
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `HOST` | Server host | `0.0.0.0` |
| `LOG_LEVEL` | Logging level | `info` |
| `NODE_ENV` | Environment | `development` |
| `POSTGRES_HOST` | PostgreSQL host | `localhost` |
| `POSTGRES_PORT` | PostgreSQL port | `5432` |
| `POSTGRES_DB` | PostgreSQL database | `learn_project` |
| `POSTGRES_USER` | PostgreSQL user | `postgres` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `postgres` |
| `MONGODB_URL` | MongoDB connection URL | `mongodb://localhost:27017` |
| `MONGODB_DB` | MongoDB database | `learn_project` |

## Database Setup

The database is automatically initialized on startup with:
- `users` table with sample data
- Required indexes

You can also manually initialize the database:

```bash
npm run db:init
```

## Development

Run the development server with hot reload:

```bash
npm run dev
```

## Production

Build and run for production:

```bash
npm run build
npm start
```

## Docker Commands

### Using Make (from project root)

```bash
make help          # Show all available commands
make db-only       # Start only databases
make dev           # Start all services in dev mode
make up            # Start all services in production mode
make down          # Stop all services
make logs          # View logs
make clean         # Remove all containers and volumes
```

### Manual Docker Commands

```bash
# Build and run production
docker build -t node-api .
docker run -p 3000:3000 \
  -e POSTGRES_HOST=host.docker.internal \
  -e MONGODB_URL=mongodb://host.docker.internal:27017 \
  node-api

# Run databases only
docker-compose -f docker-compose.local.yml up -d

# Stop databases
docker-compose -f docker-compose.local.yml down

# View database logs
docker logs postgres-local -f
docker logs mongodb-local -f
```

## API Endpoints

### General

- `GET /` - Service information and documentation
- `GET /health` - Health check with database status

### API Routes

- `GET /api/ping` - Simple ping/pong
- `GET /api/info` - Service information

### Users (PostgreSQL)

- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com"
  }
  ```

### Activity Logs (MongoDB)

- `GET /api/users/logs/activity` - Get activity logs (last 100)
- `POST /api/users/logs/activity` - Create activity log
  ```json
  {
    "action": "user_login",
    "userId": "123",
    "metadata": {
      "ip": "192.168.1.1"
    }
  }
  ```

## Project Structure

```
src/
├── config/
│   └── database.ts           # Database configuration
├── controllers/
│   ├── api.controller.ts     # General API endpoints
│   ├── health.controller.ts  # Health check endpoints
│   └── users.controller.ts   # User management endpoints
├── plugins/
│   ├── postgres.plugin.ts    # PostgreSQL plugin
│   └── mongodb.plugin.ts     # MongoDB plugin
├── scripts/
│   └── init-db.ts           # Database initialization
├── types/
│   └── fastify.d.ts         # TypeScript declarations
└── server.ts                # Main application entry
```

## Type Safety

The project includes TypeScript declarations for Fastify plugins, ensuring type-safe access to database connections throughout the application.

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production build
- `npm run type-check` - Check TypeScript types
- `npm run db:init` - Initialize PostgreSQL database

## License

Private
