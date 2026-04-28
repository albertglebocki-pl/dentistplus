import {redirect} from '@sveltejs/kit';

import * as UserService from '$lib/server/services/user.service';
import * as AdminService from '$lib/server/services/admin.service';
import * as DoctorService from '$lib/server/services/doctor.service';
import api from "$lib/server/utils/api";

export async function load({cookies, fetch, url}) {
    const token = cookies.get('token');

    if (!token) throw redirect(302, '/auth/login');

    const res = await fetch(api("/auth/me"), {
        method: "POST",
        headers: {Authorization: `Bearer ${token}`}
    });

    if (!res.ok) {
        cookies.delete('token', {path: '/'});
        throw redirect(302, '/auth/login');
    }

    const userData = await res.json();
    const role = userData.role;

  if (role === "ADMIN") {
    return { user: userData, data: await AdminService.onLoad(token) };
  }
  if (role === "USER") {
    const selectedDoctorId = url.searchParams.get("doctorId");
    const dashboardData = await UserService.onLoad(token);
    let doctorAvailability = [];

        if (selectedDoctorId) {
            doctorAvailability = await UserService.getDoctorAvailability(token, selectedDoctorId);
        }

        return {
            user: userData,
            data: dashboardData,
            doctorAvailability: doctorAvailability
        };
    }
    if (role === "DOCTOR") {
        let treatments = undefined;
        let patientVisits = undefined;

        const dashboardData = await DoctorService.onLoad(token);
        const visitIdFromUrl = url.searchParams.get("id");

        if (visitIdFromUrl) {
            const currentVisit = dashboardData.visits.find(v => v._id === visitIdFromUrl);

            if (currentVisit && currentVisit.patientId) {
                treatments = await DoctorService.getPatientTreatments(token, currentVisit.patientId);
                patientVisits = await DoctorService.getPatientVisits(token, currentVisit.patientId);
            }
        }

        return {
            user: userData,
            data: dashboardData,
            treatments: treatments,
            patientVisits: patientVisits
        }
    }
}