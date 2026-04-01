import { serve } from "@hono/node-server";
import { Hono } from "hono";
import connectMongo from "./db/mongo.js";
import { Patient, MedicalProcedure, Visit } from "./db/mongoSchema.js";

const app = new Hono();

await connectMongo();

// All endpoints are redirected via Caddy to /api/
// Here's no need for explicitly coding that, but when calling /api/* prefix should be used

app.get("/", (c) => {
  return c.text("Hello Hono!");
});


// test endpoint
app.get("/test", async (c) => {
    return c.json({ message: "backend works" });
});


serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
