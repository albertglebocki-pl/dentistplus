import { Hono } from "hono";
import { serve } from "@hono/node-server";

import connectToMongo from "./mongo/connection.js";
import { Patient, MedicalProcedure, Visit } from "./mongo/schema.js";

import ping from "./services/ping.js";
import book from "./services/visits/book.js";

const app = new Hono();

await connectToMongo();

app.route("/", ping);
app.route("/", book);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
