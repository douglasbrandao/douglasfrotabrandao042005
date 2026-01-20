COMPOSE := docker compose

.PHONY: up down build logs ps restart health

up:
	$(COMPOSE) up --build -d

down:
	$(COMPOSE) down

build:
	$(COMPOSE) build --no-cache

logs:
	$(COMPOSE) logs -f

ps:
	$(COMPOSE) ps

restart:
	$(MAKE) down && $(MAKE) up

health:
	@command -v curl >/dev/null 2>&1 || (echo "curl is required" && exit 1)
	@set -e; \
	if curl -fsS http://localhost:8080/health >/dev/null 2>&1; then \
		echo "healthy"; \
		exit 0; \
	else \
		echo "unhealthy"; \
		exit 1; \
	fi
