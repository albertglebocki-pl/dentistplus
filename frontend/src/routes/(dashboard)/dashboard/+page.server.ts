import { fail, redirect } from "@sveltejs/kit";

import * as UserService from "$lib/server/services/user.service";
import * as AdminService from "$lib/server/services/admin.service";
import * as DoctorService from "$lib/server/services/doctor.service";

export const actions = {
  book: async ({ request, cookies }) => {
    const token = cookies.get("token");
    if (!token) throw redirect(302, "/auth/login");

    const formData = await request.formData();
    const result = await UserService.bookAppointment(token, formData);

    if (!result.success) {
      return fail(400, { message: result.error });
    }

    return { success: true };
  },

  toggleUser: async ({ request, cookies }) => {
    const token = cookies.get("token");
    if (!token) throw redirect(302, "/auth/login");

    const formData = await request.formData();

    const userId = Number(formData.get("userId"));
    const active = formData.get("active") === "true";

    const result = await AdminService.toggleUser(token, userId, active);

    if (!result.success) {
      return fail(400, { message: result.error });
    }

    return { success: true };
  },

  createDoctor: async ({ request, cookies }) => {
    const token = cookies.get("token");
    if (!token) throw redirect(302, "/auth/login");

    const formData = await request.formData();

    const result = await AdminService.createDoctor(token, {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      phoneNumber: formData.get("phoneNumber") as string,
    });

    if (!result.success) {
      return fail(400, { message: result.error });
    }

    return { success: true };
  },

  createProcedure: async ({ request, cookies }) => {
    const token = cookies.get("token");
    if (!token) throw redirect(302, "/auth/login");

    const formData = await request.formData();

    const blockedByStatusesRaw = formData.get("blockedByStatuses") as string;

    const result = await AdminService.createProcedure(token, {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      defaultCost: Number(formData.get("defaultCost")),
      setsToothStatus: (formData.get("setsToothStatus") as string) || null,
      blockedByStatuses: blockedByStatusesRaw
        ? blockedByStatusesRaw
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    });

    if (!result.success) {
      return fail(400, { message: result.error });
    }

    return { success: true };
  },

  updateProcedure: async ({ request, cookies }) => {
    const token = cookies.get("token");
    if (!token) throw redirect(302, "/auth/login");

    const formData = await request.formData();
    const id = formData.get("id") as string;

    const result = await AdminService.updateProcedure(token, id, {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      defaultCost: Number(formData.get("defaultCost")),
      active: formData.get("active")
        ? formData.get("active") === "true"
        : undefined,
    });

    if (!result.success) {
      return fail(400, { message: result.error });
    }

    return { success: true };
  },

  deactivateProcedure: async ({ request, cookies }) => {
    const token = cookies.get("token");
    if (!token) throw redirect(302, "/auth/login");

    const formData = await request.formData();
    const id = formData.get("id") as string;

    const result = await AdminService.deactivateProcedure(token, id);

    if (!result.success) {
      return fail(400, { message: result.error });
    }

    return { success: true };
  },

  bookDoctor: async ({ request, cookies, url }) => {
    const token = cookies.get("token");
    if (!token) {
      redirect(302, "/auth/login");
    }

    const formData = await request.formData();
    const result = await DoctorService.bookAppointment(token, formData);

    if (!result.success) {
      return fail(400, { message: result.error });
    }

    return { success: true };
  },

  doctorUpdateVisit: async ({ request, cookies, url }) => {
    const token = cookies.get("token");
    if (!token) {
      redirect(302, "/auth/login");
    }

    const formData = await request.formData();
    const result = await DoctorService.updateVisit(token, formData);

    console.log("result", result);

    if (!result.success) {
      return fail(400, { message: result.error });
    }

    return { success: true };
  },
};
