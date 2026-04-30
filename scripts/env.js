import fs from "fs";
import crypto from "crypto";

export function rand() {
  return crypto.randomBytes(32).toString("hex");
}

export function loadEnv(path = ".env") {
  if (!fs.existsSync(path)) return {};

  const raw = fs.readFileSync(path, "utf-8");
  const env = {};

  for (const line of raw.split("\n")) {
    const [k, ...v] = line.split("=");
    if (!k) continue;
    env[k.trim()] = v.join("=").trim();
  }

  return env;
}

export function writeEnv(mode = "PROD") {
  if (fs.existsSync(".env")) return;

  const content = `
STORAGE_RPC_SECRET=${rand()}
STORAGE_ADMIN_TOKEN=${rand()}
STORAGE_BUCKET=patient-images
POSTGRES_USER=admin
POSTGRES_PASSWORD=${rand()}
POSTGRES_DB=dentistplus
MONGO_USER=admin
MONGO_PASSWORD=${rand()}
MONGO_DB=dentistplus
JWT_SECRET=${rand()}
MODE=${mode}
`.trim();

  fs.writeFileSync(".env", content + "\n");
}
