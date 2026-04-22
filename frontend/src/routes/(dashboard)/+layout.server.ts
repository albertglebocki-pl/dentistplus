import {redirect} from '@sveltejs/kit';

import * as UserService from '$lib/server/services/user.service';
import * as AdminService from '$lib/server/services/admin.service';
import * as DoctorService from '$lib/server/services/doctor.service';

export async function load({cookies, fetch}) {
    const token = cookies.get('token');

    if (!token) {
        throw redirect(302, '/auth/login');
    }

    const res = await fetch('http://backend:3000/auth/me', {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) {
        cookies.delete('token', {path: '/'});
        throw redirect(302, '/auth/login');
    }

    const userData = await res.json();
    const role = userData.role;

    if (role === "ADMIN") {
        return {user: userData, data: await AdminService.onLoad()}
    }
    if (role === "USER") {
        return {user: userData, data: await UserService.onLoad(token)}
    }
    if (role === "DOCTOR") {
        return {user: userData, data: await DoctorService.onLoad()}
    }
}