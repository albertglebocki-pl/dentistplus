import { execSync } from "child_process";
import fs from "fs";

import setup from "./setup.js";
import generateGarage from "./storage.js";

function run(cmd) {
  execSync(cmd, { stdio: "inherit", shell: true });
}

function install() {
  run("npm install --prefix ./drizzle");
  run("npm install --prefix ./frontend");
  run("npm install --prefix ./backend");
}

function generate() {
  run("cd drizzle && npx dotenv -e ../.env drizzle-kit generate");
  generateGarage();
}

function sync() {
  run("cd frontend && npx svelte-kit sync");
}

function startDocker() {
  run("docker compose up -d --build --remove-orphans");
}

function startDockerDev() {
  run(
    "docker compose -f docker-compose.yaml -f docker-compose.dev.yaml up --build --remove-orphans",
  );
}

function stopDocker() {
  run("docker compose down");
}

function cleanAll() {
  run("docker compose down -v");

  if (fs.existsSync(".env")) fs.rmSync(".env");
  if (fs.existsSync("storage")) {
    fs.rmSync("storage/garage.toml", { force: true });
  }
}

const [, , command, arg] = process.argv;

switch (command) {
  case "setup":
    setup(arg || "prod");
    break;

  case "install":
    install();
    break;

  case "generate":
    generate();
    break;

  case "sync":
    sync();
    break;

  case "start":
    setup("prod");
    install();
    generate();
    sync();
    startDocker();
    break;

  case "dev":
    setup("dev");
    install();
    generate();
    sync();
    startDockerDev();
    break;

  case "stop":
    stopDocker();
    break;

  case "clean":
    cleanAll();
    break;

  case "restart":
    stopDocker();
    startDocker();
    break;

  default:
    break;
}
