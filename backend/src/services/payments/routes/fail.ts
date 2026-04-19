import { Hono } from "hono";
import { findPaymentByToken } from "../service.js";

const service = new Hono();

service.post("/fail/:token", async (c) => {
  const payment = await findPaymentByToken(c.req.param("token"));

  if (!payment) {
    return c.json({ error: "Payment not found" }, 404);
  }

  if (payment.status !== "PENDING") {
    return c.json({ error: "Payment not pending" }, 400);
  }

  payment.status = "FAILED";

  await payment.save();

  return c.json({
    success: false,
    message: "Payment failed",
    redirectUrl: payment.errorUrl ?? null,
  });
});

export default service;
