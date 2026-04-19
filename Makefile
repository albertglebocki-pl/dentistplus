setup:
	sh environment-setup.sh

generate:
	cd drizzle && npx dotenv -e ../.env drizzle-kit generate
	rm -f backend/src/postgres/schema.ts
	cp drizzle/schema.ts backend/src/postgres

install_deps:
	npm install --prefix ./drizzle
	npm install --prefix ./frontend
	npm install --prefix ./backend

sync:
	cd frontend && npx svelte-kit sync

start: setup install_deps generate sync
	docker compose up -d --build --remove-orphans --no-cache

dev: setup install_deps generate sync
	docker compose -f docker-compose.yaml -f docker-compose.dev.yaml up --build --remove-orphans

stop:
	docker compose down

clean: stop
	cd drizzle && rm -rf migrations
	docker compose down -v
	rm -f .env

clean_node:
	rm -rf frontend/node_modules/
	rm -f frontend/package-lock.json
	rm -rf backend/node_modules/
	rm -f backend/package-lock.json
	rm -rf drizzle/node_modules/
	rm -f drizzle/package-lock.json

restart: stop start
