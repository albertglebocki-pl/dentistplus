import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { getPayment } from "$lib/server/services/payment.service";

export const load: PageServerLoad = async ({ params, cookies }) => {
  const token = cookies.get("token");

  if (!token) throw redirect(302, "/login");

  const payment = await getPayment(params.id, token);

  return {
    payment,
  };
};
