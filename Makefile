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

init_storage:
	@echo "Waiting for GARAGE to start..."
	@until docker compose exec storage garage status > /dev/null 2>&1; do sleep 2; done
	@echo "Initializing GARAGE node..."
	$(eval NODE_ID := $(shell docker compose exec storage garage node id 2>/dev/null | grep -oE '^[a-f0-9]+' | head -1))
	docker compose exec storage garage layout assign -z dc1 -c 1G $(NODE_ID)
	docker compose exec storage garage layout apply --version 1
	@echo "Creating storage bucket..."
	docker compose exec storage garage bucket create $$(grep STORAGE_BUCKET .env | cut -d= -f2)
	@echo "Assigning storage bucket key..."
	docker compose exec storage garage key import \
		--name backend-key \
		$$(grep STORAGE_KEY_ID .env | cut -d= -f2) \
		$$(grep STORAGE_SECRET_KEY .env | cut -d= -f2)
	docker compose exec storage garage bucket allow \
		--read --write --owner \
		--key $$(grep STORAGE_KEY_ID .env | cut -d= -f2) \
		$$(grep STORAGE_BUCKET .env | cut -d= -f2)
	@echo "Storage is ready!"

start: setup install_deps generate sync
	docker compose up -d --build --remove-orphans --no-cache
	$(MAKE) init_storage

dev: setup install_deps generate sync
	docker compose -f docker-compose.yaml -f docker-compose.dev.yaml up --build --remove-orphans
	$(MAKE) init_storage

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
