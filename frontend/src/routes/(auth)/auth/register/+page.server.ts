import {fail, redirect} from '@sveltejs/kit';
import type {Actions} from './$types';

export const actions: Actions = {
    default: async ({request, fetch, cookies}) => {
        const data = await request.formData();
        const email = data.get('email');
        const password = data.get('password');
        const confirm = data.get('confirm');
        const fullName = data.get('fullName');

        const nameParts = String(fullName).trim().split(" ").filter(el => el != '')
        const firstName = nameParts[0];
        const lastName = nameParts[1];

        if (password !== confirm) {
            return fail(400, {error: "Passwords are different"})
        }

        if (!firstName || !lastName) {
            return fail(400, {error: "First name and last name are required"});
        }

        const res = await fetch("http://backend:3000/auth/register", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email,
                password,
                firstName,
                lastName,
                address: data.get('address'),
                phoneNumber: data.get('phoneNumber')
            }),
        });

        const result = await res.json();

        if (!res.ok) {
            return fail(res.status, {error: result.error || "Something went wrong"});
        }

        cookies.set("token", result.token, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
        });

        throw redirect(303, "/dashboard");
    }
};