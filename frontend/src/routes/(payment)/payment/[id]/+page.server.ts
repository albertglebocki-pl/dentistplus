import { redirect, fail } from "@sveltejs/kit";
import {
  getPayment,
  payPayment,
  failPayment,
} from "$lib/server/services/payment.service";

function isTestCard(number: string) {
  const normalized = number.replace(/\s/g, "");

  const visa = "4111111111111111";
  const mastercard = "5555555555554444";

  return normalized === visa || normalized === mastercard;
}

export const load = async ({ params, cookies }) => {
  const token = cookies.get("token");

  if (!token) throw redirect(302, "/login");

  const payment = await getPayment(params.id, token);

  return { payment };
};

export const actions = {
  pay: async ({ request, params }) => {
    const form = await request.formData();

    const cardNumber = String(form.get("cardNumber") || "");
    const expiry = String(form.get("expiry") || "");
    const cvc = String(form.get("cvc") || "");

    if (!cardNumber || !expiry || !cvc) {
      return fail(400, { error: "Missing card data" });
    }

    const valid = isTestCard(cardNumber);

    if (!valid) {
      await failPayment(params.id);
      throw redirect(303, "/payment/failure");
    }

    const result = await payPayment(params.id);

    if (!result.ok) {
      await failPayment(params.id);
      throw redirect(303, "/payment/failure");
    }

    const redirectUrl = result.data.redirectUrl || "/payment/success";

    throw redirect(303, redirectUrl);
  },
};
