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

start: install_deps setup generate sync
	docker compose up -d --build --remove-orphans

dev: install_deps setup generate sync
	docker compose -f docker-compose.yaml -f docker-compose.dev.yaml up --build --remove-orphans

stop:
	docker compose down

clean: stop
	cd drizzle && rm -rf migrations
	docker compose down -v
	rm -f .env

restart: stop start
