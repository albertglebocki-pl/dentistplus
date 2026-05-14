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

  changePassword: async ({ request, cookies }) => {
    const token = cookies.get("token");
    if (!token) throw redirect(302, "/auth/login");

    const formData = await request.formData();
    const oldPassword = String(formData.get("oldPassword") ?? "");
    const newPassword = String(formData.get("newPassword") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (!oldPassword || !newPassword || !confirmPassword)
      return fail(400, { passwordError: "All fields are required" });

    if (newPassword !== confirmPassword)
      return fail(400, { passwordError: "Passwords do not match" });

    if (newPassword.length < 8)
      return fail(400, {
        passwordError: "Password must be at least 8 characters",
      });

    const result = await AccountService.changePassword(token, {
      oldPassword,
      newPassword,
    });
    if (!result.success) return fail(400, { passwordError: result.error });

    cookies.set("flash", "Password changed successfully", {
      path: "/",
      maxAge: 5,
    });

    throw redirect(303, "/auth/logout");
  },
};
