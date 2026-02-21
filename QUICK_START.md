# Quick Start Guide

Get up and running with the Learn Project in minutes!

## Prerequisites

- Docker Desktop installed and running
- (Optional) Node.js 20+ for local development

## 🚀 Fastest Way to Start

### Option 1: Everything in Docker (Easiest)

```bash
# Start all services in development mode
make dev

# Wait about 30 seconds for everything to start, then access:
# - node-api: http://localhost:3000
# - core-api: http://localhost:8080
# - frontend: http://localhost:5173
# - angular-frontend: http://localhost:4200
```

### Option 2: Local Development (Recommended for node-api development)

```bash
# Start databases only
./start-dev.sh

# In another terminal, install dependencies and start node-api
cd services/node-api
npm install              # ⚠️ IMPORTANT: Must run this first!
npm run dev

# Access node-api at http://localhost:3000
```

> **⚠️ Important:** You must run `npm install` before starting the API, or you'll get database connection errors!

## 🧪 Test Your Setup

```bash
# Run the test script
./test-api.sh

# Or manually test
curl http://localhost:3000/health
```

## 📚 Available Commands

```bash
make help          # Show all available commands
make db-only       # Start only databases
make dev           # Start all services (dev mode)
make up            # Start all services (production mode)
make down          # Stop all services
make logs          # View logs
make clean         # Clean everything
```

## 🔍 What's Running?

### Databases
- **PostgreSQL**: localhost:5432 (user: postgres, password: postgres)
- **MongoDB**: localhost:27017

### Services
- **node-api**: http://localhost:3000
  - Fastify + TypeScript
  - PostgreSQL for users
  - MongoDB for activity logs
  - Auto-initializes database

- **core-api**: http://localhost:8080
  - .NET 8.0 Web API
  - Swagger UI at /swagger

- **frontend**: http://localhost:5173
  - React + Vite

- **angular-frontend**: http://localhost:4200
  - Angular 21

## 📖 API Examples

### Check Health
```bash
curl http://localhost:3000/health
```

### List Users
```bash
curl http://localhost:3000/api/users
```

### Create User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

### Create Activity Log
```bash
curl -X POST http://localhost:3000/api/users/logs/activity \
  -H "Content-Type: application/json" \
  -d '{"action":"user_login","userId":"1"}'
```

### Get Activity Logs
```bash
curl http://localhost:3000/api/users/logs/activity
```

## 🛠️ Development Workflow

### Working on node-api

```bash
# 1. Start databases
make db-only

# 2. Start node-api with hot reload
cd services/node-api
npm run dev

# 3. Make changes - they'll reload automatically

# 4. Test your changes
curl http://localhost:3000/health
```

### Working on other services

```bash
# Start everything in Docker
make dev

# Make changes to your service
# Rebuild specific service
docker-compose -f docker-compose.dev.yml up -d --build node-api
```

## 📊 View Logs

```bash
# All services
make logs

# Specific service
docker logs node-api-dev -f
docker logs postgres-local -f
docker logs mongodb-local -f
```

## 🗄️ Access Databases

### PostgreSQL
```bash
# Using Docker
docker exec -it postgres-local psql -U postgres -d learn_project

# Using local psql
psql -h localhost -U postgres -d learn_project
```

### MongoDB
```bash
# Using Docker
docker exec -it mongodb-local mongosh learn_project

# Using local mongosh
mongosh mongodb://localhost:27017/learn_project
```

## 🧹 Clean Up

```bash
# Stop all services
make down

# Stop and remove everything (including data)
make clean
```

## ❓ Troubleshooting

### ⚠️ Most Common Issue: Database Connection Failed

**Symptom:** Health check shows `"postgres": "disconnected"` and `"mongodb": "disconnected"`

**Solution:** Install dependencies first!

```bash
cd services/node-api
npm install              # ⚠️ This is required!
npm run dev
```

### Port Already in Use
```bash
# Check what's using the port
lsof -i :3000
lsof -i :5432
lsof -i :27017

# Stop the conflicting service or change the port
```

### Database Connection Failed
```bash
# Check if databases are running
docker ps

# Restart databases
make db-down
make db-only
```

### API Not Starting
```bash
# Check logs
docker logs node-api-dev

# Or if running locally
cd services/node-api
npm run dev
```

### Start Fresh
```bash
# Clean everything and start over
make clean
make dev
```

### Need More Help?

See **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** for detailed solutions to common issues.

## 📚 More Documentation

- **[SETUP_SUMMARY.md](SETUP_SUMMARY.md)** - Complete setup details
- **[DOCKER_GUIDE.md](DOCKER_GUIDE.md)** - Comprehensive Docker guide
- **[services/node-api/README.md](services/node-api/README.md)** - node-api documentation
- **[README.md](README.md)** - Project overview

## 🎯 Next Steps

1. ✅ Get everything running (you're here!)
2. 📖 Read the API documentation
3. 🧪 Run the test script: `./test-api.sh`
4. 💻 Start coding!
5. 🚀 Deploy to production

## 💡 Tips

- Use `make db-only` for fastest local development
- Use `make dev` when working on multiple services
- Check `make help` for all available commands
- Run `./test-api.sh` to verify everything works
- View logs with `make logs` if something goes wrong

## 🆘 Need Help?

1. Check if Docker is running
2. Run `./test-api.sh` to diagnose issues
3. Check logs: `make logs`
4. Try cleaning and restarting: `make clean && make dev`
5. Review the detailed guides in the documentation

---

**Ready to code? Start with:**
```bash
./start-dev.sh
cd services/node-api
npm run dev
```

Then visit http://localhost:3000/health to see it working! 🎉
