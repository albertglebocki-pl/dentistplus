import { Hono } from "hono";
import { serve } from "@hono/node-server";

import connectMongo from "./mongo/connection.js";

import ping from "./services/ping.js";
import login from "./services/auth/routes/login.js";
import register from "./services/auth/routes/register.js";
import me from "./services/auth/routes/me.js";

const app = new Hono();

await connectMongo();

app.route("/", ping);

app.route("/auth", login);
app.route("/auth", register);
app.route("/auth", me);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
