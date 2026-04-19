import { Hono } from "hono";

const service = new Hono();

service.get("/ping", (context) => {
  return context.json({ message: "pong" });
});

export default service;
