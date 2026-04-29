#!/bin/sh
if [ ! -f .env ]; then
  cat > .env <<EOF
STORAGE_RPC_SECRET=$(openssl rand -hex 32)
STORAGE_ADMIN_TOKEN=$(openssl rand -hex 32)
STORAGE_KEY_ID=$(openssl rand -hex 10)
STORAGE_SECRET_KEY=$(openssl rand -hex 20)
STORAGE_BUCKET=patient-images
POSTGRES_USER=admin
POSTGRES_PASSWORD=$(openssl rand -hex 32)
POSTGRES_DB=dentistplus
MONGO_USER=admin
MONGO_PASSWORD=$(openssl rand -hex 32)
MONGO_DB=dentistplus
JWT_SECRET=$(openssl rand -hex 32)
MODE=DEV
EOF
fi

STORAGE_ADMIN_TOKEN=$(grep '^STORAGE_ADMIN_TOKEN=' .env | cut -d'=' -f2)

mkdir -p storage

cat > storage/garage.toml <<EOF
metadata_dir = "/var/lib/garage/meta"
data_dir = "/var/lib/garage/data"
db_engine = "lmdb"
replication_factor = 1
rpc_bind_addr = "[::]:3901"
rpc_public_addr = "storage:3901"

[s3_api]
s3_region = "garage"
api_bind_addr = "[::]:3902"

[admin]
api_bind_addr = "[::]:3903"
admin_token = "${STORAGE_ADMIN_TOKEN}"
EOF
