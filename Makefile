.PHONY: help up down logs clean dev dev-down db-only db-down restart

help:
	@echo "Available commands:"
	@echo "  make up          - Start all services (production mode)"
	@echo "  make down        - Stop all services"
	@echo "  make logs        - View logs from all services"
	@echo "  make clean       - Remove all containers, volumes, and images"
	@echo "  make dev         - Start all services in development mode"
	@echo "  make dev-down    - Stop development services"
	@echo "  make db-only     - Start only databases (for local development)"
	@echo "  make db-down     - Stop databases"
	@echo "  make restart     - Restart all services"

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

clean:
	docker-compose down -v --rmi all

dev:
	docker-compose -f docker-compose.dev.yml up -d

dev-down:
	docker-compose -f docker-compose.dev.yml down

db-only:
	cd services/node-api && docker-compose -f docker-compose.local.yml up -d

db-down:
	cd services/node-api && docker-compose -f docker-compose.local.yml down

restart:
	docker-compose restart
