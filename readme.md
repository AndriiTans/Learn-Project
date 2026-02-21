# Learn Project

A microservices project structure with Docker support, including PostgreSQL and MongoDB databases.

## 🚀 Quick Start

**New to the project?** Start here: **[QUICK_START.md](QUICK_START.md)**

```bash
# Fastest way to get started
./start-dev.sh
cd services/node-api && npm run dev

# Or run everything in Docker
make dev
```

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Get up and running in minutes
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions
- **[SETUP_SUMMARY.md](SETUP_SUMMARY.md)** - Complete setup details
- **[DOCKER_GUIDE.md](DOCKER_GUIDE.md)** - Comprehensive Docker guide
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture overview
- **[services/node-api/README.md](services/node-api/README.md)** - node-api documentation

## Project Structure

```
Learn-Project/
├── services/
│   ├── core-api/          # .NET 8.0 Web API service
│   │   ├── Controllers/
│   │   ├── Program.cs
│   │   ├── core-api.csproj
│   │   ├── Dockerfile
│   │   └── appsettings.json
│   ├── node-api/          # Node.js Fastify API service (TypeScript)
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── plugins/
│   │   │   ├── config/
│   │   │   └── server.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── Dockerfile
│   │   └── Dockerfile.dev
│   ├── frontend/          # React + Vite frontend service
│   │   ├── src/
│   │   ├── package.json
│   │   └── Dockerfile
│   └── angular-frontend/  # Angular frontend service
│       ├── src/
│       ├── angular.json
│       ├── package.json
│       └── Dockerfile
├── docker-compose.yml     # Production Docker Compose
├── docker-compose.dev.yml # Development Docker Compose
├── Makefile              # Convenient commands
└── README.md
```

## Prerequisites

- Docker and Docker Compose installed
- .NET 8.0 SDK (optional, for local development)
- Node.js 20+ (optional, for local development)

## Quick Start

### Using Make Commands (Recommended)

```bash
# Show all available commands
make help

# Start only databases (for local development)
make db-only

# Start all services in development mode
make dev

# Start all services in production mode
make up

# View logs
make logs

# Stop all services
make down

# Clean up everything
make clean
```

### Using Docker Compose Directly

#### Production Mode

```bash
# Start all services
docker-compose up -d

# Stop services
docker-compose down
```

#### Development Mode

```bash
# Start all services with hot reload
docker-compose -f docker-compose.dev.yml up -d

# Stop services
docker-compose -f docker-compose.dev.yml down
```

#### Databases Only (for local development)

```bash
# Start PostgreSQL and MongoDB
cd services/node-api
docker-compose -f docker-compose.local.yml up -d

# Stop databases
docker-compose -f docker-compose.local.yml down
```

## Services

### postgres

PostgreSQL 16 database service running on port 5432.

- Host: `localhost:5432`
- Database: `learn_project`
- User: `postgres`
- Password: `postgres`
- Persistent storage via Docker volumes

### mongodb

MongoDB 7 database service running on port 27017.

- Host: `localhost:27017`
- Database: `learn_project`
- Persistent storage via Docker volumes

### core-api

A .NET 8.0 Web API service running on port 8080.

- API Endpoint: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger` (in Development mode)
- Example endpoint: `GET http://localhost:8080/api/weatherforecast`

### node-api

A Node.js Fastify API service with TypeScript running on port 3000.

- API Endpoint: `http://localhost:3000`
- Health endpoint: `GET http://localhost:3000/health`
- Features:
  - PostgreSQL integration for user management
  - MongoDB integration for activity logs
  - Auto-initializes database on startup
  - TypeScript with hot reload in dev mode
- Example endpoints:
  - `GET http://localhost:3000/api/ping`
  - `GET http://localhost:3000/api/users`
  - `POST http://localhost:3000/api/users`
  - `GET http://localhost:3000/api/users/logs/activity`

### angular-frontend

An Angular 21 frontend service running on port 4200.

- Frontend URL: `http://localhost:4200`
- Calls backend via `/api` proxy to `core-api`

### frontend

A React + Vite frontend service running on port 5173.

- Frontend URL: `http://localhost:5173`
- Calls backend via `/api` proxy to `core-api`
- Example page: weather table from `core-api` endpoint

## Local Development (without Docker)

Navigate to the service directory and run:

```bash
cd services/core-api
dotnet restore
dotnet run
```

The API will be available at `http://localhost:5000` (or the port specified in launchSettings.json).

For Node.js service:

```bash
# Start databases first
make db-only

# Or manually:
cd services/node-api
docker-compose -f docker-compose.local.yml up -d

# Then run the API
cd services/node-api
npm install
npm run dev
```

The API will be available at `http://localhost:3000`.

**Note:** The node-api service requires PostgreSQL and MongoDB to be running. Use the `make db-only` command to start just the databases.

For frontend service:

```bash
cd services/frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

For Angular frontend service:

```bash
cd services/angular-frontend
npm install
npm start
```

The app will be available at `http://localhost:4200`.
