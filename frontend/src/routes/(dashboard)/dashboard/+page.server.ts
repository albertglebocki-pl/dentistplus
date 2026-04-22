import {fail, redirect} from '@sveltejs/kit';

import * as UserService from '$lib/server/services/user.service';
import * as AdminService from '$lib/server/services/admin.service';
import * as DoctorService from '$lib/server/services/doctor.service';

export const actions = {
    book: async ({request, cookies}) => {
        const token = cookies.get('token');
        if (!token) {
            redirect(302, '/auth/login');
        }

        const formData = await request.formData();
        const result = await UserService.bookAppointment(token, formData);

        if (!result.success) {
            return fail(400, {message: result.error});
        }

        return {success: true};
    }
}