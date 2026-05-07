import { Hono } from "hono";
import { findPaymentById } from "../service.js";

const service = new Hono();

service.post("/pay/:id", async (c) => {
  const payment = await findPaymentById(c.req.param("id"));

  if (!payment) {
    return c.json({ error: "Payment not found" }, 404);
  }

  if (payment.status === "COMPLETED") {
    return c.json({ error: "Payment already completed" }, 400);
  }

  if (payment.status === "FAILED") {
    return c.json({ error: "Payment failed" }, 400);
  }

  payment.status = "COMPLETED";
  payment.paidAt = new Date();

  await payment.save();

  return c.json({
    success: true,
    message: "Payment successful",
    redirectUrl: payment.successUrl ?? null,
  });
});

export default service;
