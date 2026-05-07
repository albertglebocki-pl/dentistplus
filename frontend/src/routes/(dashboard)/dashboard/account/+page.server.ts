import { fail, redirect } from "@sveltejs/kit";
import * as AccountService from "$lib/server/services/account.service";

export const actions = {
  updateProfile: async ({ request, cookies }) => {
    const token = cookies.get("token");
    if (!token) throw redirect(302, "/auth/login");

    const formData = await request.formData();

    const payload = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      address: formData.get("address"),
      phoneNumber: formData.get("phoneNumber"),
    };

    const result = await AccountService.updateProfile(token, payload);

    if (!result.success) {
      return fail(400, { error: result.error });
    }

    return { success: true };
  },
};
