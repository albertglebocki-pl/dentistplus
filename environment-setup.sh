#!/bin/sh
if [ ! -f .env ]; then
  cat > .env <<EOF
STORAGE_RPC_SECRET=$(openssl rand -hex 32)
STORAGE_ADMIN_TOKEN=$(openssl rand -hex 32)
STORAGE_KEY_ID=$(openssl rand -hex 10)
STORAGE_SECRET_KEY=$(openssl rand -hex 20)
POSTGRES_USER=admin
POSTGRES_PASSWORD=$(openssl rand -hex 32)
POSTGRES_DB=dentistplus
MONGO_USER=admin
MONGO_PASSWORD=$(openssl rand -hex 32)
MONGO_DB=dentistplus
JWT_SECRET=$(openssl rand -hex 32)
EOF
fi
