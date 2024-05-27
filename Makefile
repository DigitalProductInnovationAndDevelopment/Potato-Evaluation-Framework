# Makefile for managing Karevo's Docker environment

COMPOSE_FILE = docker-compose.yml

# Targets
.PHONY: all build run start stop down clean logs

build-and-run: build run

build:
	@echo "Building Docker images..."
	docker-compose -f $(COMPOSE_FILE) build

run:
	@echo "Starting Docker Compose services..."
	docker-compose -f $(COMPOSE_FILE) up -d

start: run

stop:
	@echo "Stopping Docker Compose services..."
	docker-compose -f $(COMPOSE_FILE) stop

down:
	@echo "Stopping and removing Docker Compose services..."
	docker-compose -f $(COMPOSE_FILE) down

clean: down
	@echo "Removing Docker Compose resources..."
	docker-compose -f $(COMPOSE_FILE) down -v --rmi all --remove-orphans

logs:
	@echo "Tailing Docker Compose logs..."
	docker-compose -f $(COMPOSE_FILE) logs -f
