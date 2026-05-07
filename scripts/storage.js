import fs from "fs";
import { loadEnv } from "./env.js";

export default function generateGarage() {
  const env = loadEnv(".env");

  fs.mkdirSync("storage", { recursive: true });

  const toml = `
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
admin_token = "${env.STORAGE_ADMIN_TOKEN}"
`.trim();

  fs.writeFileSync("storage/garage.toml", toml + "\n");
  console.log("STORAGE CONFIGURATION READY");
}
