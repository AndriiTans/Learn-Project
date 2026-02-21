#!/bin/bash

# Start Development Environment Script
# This script starts the databases and provides instructions for running services

set -e

echo "🚀 Starting Learn Project Development Environment"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

echo "📦 Starting PostgreSQL and MongoDB..."
cd services/node-api
docker-compose -f docker-compose.local.yml up -d

echo ""
echo "⏳ Waiting for databases to be ready..."
sleep 5

# Check PostgreSQL
echo -n "Checking PostgreSQL... "
if docker exec postgres-local pg_isready -U postgres > /dev/null 2>&1; then
    echo "✅ Ready"
else
    echo "⚠️  Starting (may take a few more seconds)"
fi

# Check MongoDB
echo -n "Checking MongoDB... "
if docker exec mongodb-local mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo "✅ Ready"
else
    echo "⚠️  Starting (may take a few more seconds)"
fi

cd ../..

echo ""
echo "✅ Databases are running!"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Start node-api service:"
echo "   cd services/node-api"
echo "   npm install"
echo "   npm run dev"
echo ""
echo "2. Access services:"
echo "   - node-api: http://localhost:3000"
echo "   - PostgreSQL: localhost:5432 (user: postgres, password: postgres)"
echo "   - MongoDB: localhost:27017"
echo ""
echo "3. To stop databases:"
echo "   make db-down"
echo "   or"
echo "   cd services/node-api && docker-compose -f docker-compose.local.yml down"
echo ""
echo "4. View database logs:"
echo "   docker logs postgres-local -f"
echo "   docker logs mongodb-local -f"
echo ""
