import { writeEnv } from "./env.js";

export default function setup(mode) {
  writeEnv(mode === "dev" ? "DEV" : "PROD");
  console.log(`ENVIRONMENT READY (${mode})`);
}
