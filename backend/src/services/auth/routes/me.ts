import { Hono } from "hono";
import { authMiddleware } from "../middleware.js";

const service = new Hono();

service.get("/me", authMiddleware, (context) => {
  return context.json({
    user: context.get("user"),
  });
});

export default service;
