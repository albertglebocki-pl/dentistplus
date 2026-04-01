setup:
	sh environment-setup.sh

generate:
	cd drizzle && npx dotenv -e ../.env drizzle-kit generate
	rm -f backend/src/schema.ts frontend/src/lib/server/schema.ts
	cp drizzle/schema.ts backend/src
	cp drizzle/schema.ts frontend/src/lib/server

install_deps:
	npm install --prefix ./drizzle
	npm install --prefix ./frontend
	npm install --prefix ./backend

sync:
	cd frontend && npx svelte-kit sync

start: setup install_deps generate sync
	docker compose up -d --build --remove-orphans

dev: setup install_deps generate sync
	docker compose -f docker-compose.yaml -f docker-compose.dev.yaml up --build --remove-orphans

stop:
	docker compose down

clean: stop
	cd drizzle && rm -rf migrations
	docker compose down -v
	rm -f .env

clean_node:
	cd frontend && rm -rf node_modules/
	cd backend && rm -rf node_modules/
	cd drizzle && rm -rf node_modules/

restart: stop start
