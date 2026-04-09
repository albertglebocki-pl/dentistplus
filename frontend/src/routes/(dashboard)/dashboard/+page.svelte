<script lang="ts">
    import type { PageData } from "./$types";
    import { enhance } from "$app/forms";

    import Calendar from "$lib/components/Calendar.svelte";
    import AppointmentBooking from "$lib/components/AppointmentBooking.svelte";
    import {getWeekFirstDay, getISOWeek} from "$lib/utils/date.js";

    const { data }: { data: PageData } = $props();

    let currentDate = $state(new Date());
    let currentMonth = $state(currentDate.getMonth())
    let showAddDoctor = $state(false);
    let bookError = $state("");
    let calendarData = $state(data.calendarData);
    let firstWeekDay = $state(getWeekFirstDay(new Date()));
    let activeTab: "doctors" | "patients" = $state("doctors");

    const handleAddDoctor = () => {
        return ({ result }: any) => {
            if (result.type === "success") showAddDoctor = false;
        };
    };

    const toggleBlockUser = async (id: number, active: boolean) => {
        const formData = new FormData();
        formData.append("id", String(id));
        formData.append("active", String(active));

        const res = await fetch("/dashboard", {
            method: "POST",
            body: formData,
        });

        if (res.ok) {
            location.reload();
        }
    };

    const refreshCalendarData = async () => {
        const { year, week } = getISOWeek(new Date());

        const res = await fetch(`/api/get-visits/${year}/${week}?doctorId=1&userId=${data.user.sub}`);
        const json = await res.json();

        calendarData = json.calendarData;
    };

    const handleBooking = async (formData: any) => {
        bookError = "";

        const payload = {
            userId: data.user.sub,
            ...formData
        };

        try {
            const res = await fetch("/api/book-visit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const resData = await res.json();

            if (res.ok) {
                await refreshCalendarData();
            } else {
                bookError = resData.error || "An unknown error occurred";
            }
        } catch (err) {
            bookError = "Could not connect to the server.";
        }
    };

    const onPreviousWeek = async () => {
        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() - 7);

        firstWeekDay = getWeekFirstDay(currentDate);

        await refreshCalendarData();
    };

    const onNextWeek = async () => {
        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + 7);

        firstWeekDay = getWeekFirstDay(currentDate);

        await refreshCalendarData();
    };
</script>

{#if data.user.role === "ADMIN"}
    <div class="max-w-5xl mx-auto mt-6 px-4">
        <div class="flex gap-4 mb-4">
            <button
                class="px-4 py-2 rounded border"
                class:font-bold={activeTab === "doctors"}
                onclick={() => (activeTab = "doctors")}
            >
                Doctors
            </button>
            <button
                class="px-4 py-2 rounded border"
                class:font-bold={activeTab === "patients"}
                onclick={() => (activeTab = "patients")}
            >
                Patients
            </button>
            <button
                class="ml-auto px-4 py-2 rounded bg-primary text-secondary"
                onclick={() => (showAddDoctor = !showAddDoctor)}
            >
                Add Doctor
            </button>
        </div>

        {#if showAddDoctor}
            <form
                method="POST"
                action="?/addDoctor"
                use:enhance={handleAddDoctor()}
                class="p-4 border rounded mb-4"
            >
                <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    class="mb-2 w-full p-2 border rounded"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    class="mb-2 w-full p-2 border rounded"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    class="mb-2 w-full p-2 border rounded"
                />
                <button
                    type="submit"
                    class="px-4 py-2 bg-primary text-secondary rounded"
                    >Add Doctor</button
                >
            </form>
        {/if}

        {#if activeTab === "doctors"}
            <h2 class="text-lg font-bold mb-2">Doctors</h2>
            <table class="w-full border">
                <thead>
                    <tr>
                        <th class="border px-2 py-1">Name</th>
                        <th class="border px-2 py-1">Email</th>
                        <th class="border px-2 py-1">Active</th>
                        <th class="border px-2 py-1">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each data.doctors as doctor}
                        <tr>
                            <td class="border px-2 py-1"
                                >{doctor.firstName} {doctor.lastName}</td
                            >
                            <td class="border px-2 py-1">{doctor.email}</td>
                            <td class="border px-2 py-1"
                                >{doctor.active ? "Yes" : "No"}</td
                            >
                            <td class="border px-2 py-1">
                                <button
                                    class="px-2 py-1 bg-primary text-secondary rounded"
                                    onclick={() =>
                                        toggleBlockUser(
                                            doctor.id,
                                            doctor.active,
                                        )}
                                >
                                    {doctor.active ? "Block" : "Unblock"}
                                </button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {:else}
            <h2 class="text-lg font-bold mb-2">Patients</h2>
            <table class="w-full border">
                <thead>
                    <tr>
                        <th class="border px-2 py-1">Name</th>
                        <th class="border px-2 py-1">Email</th>
                        <th class="border px-2 py-1">Active</th>
                        <th class="border px-2 py-1">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each data.patients as patient}
                        <tr>
                            <td class="border px-2 py-1"
                                >{patient.firstName} {patient.lastName}</td
                            >
                            <td class="border px-2 py-1">{patient.email}</td>
                            <td class="border px-2 py-1"
                                >{patient.active ? "Yes" : "No"}</td
                            >
                            <td class="border px-2 py-1">
                                <button
                                    class="px-2 py-1 bg-primary text-secondary rounded"
                                    onclick={() =>
                                        toggleBlockUser(
                                            patient.id,
                                            patient.active,
                                        )}
                                >
                                    {patient.active ? "Block" : "Unblock"}
                                </button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/if}
    </div>
{:else}
    <div class="max-w-5xl mx-auto mt-6 px-4">
        <h2 class="text-lg font-bold mb-2">Account Info</h2>
        <p>Email: {data.user.email}</p>
        <p>Role: {data.user.role}</p>
        <form method="POST" action="?/logout" class="mt-2">
            <button class="px-4 py-2 rounded bg-primary text-secondary"
                >Logout</button
            >
        </form>
    </div>

    <Calendar calendarData={calendarData}
              weekStart={currentDate}
              onPreviousWeek={onPreviousWeek}
              onNextWeek={onNextWeek}
    />
    <AppointmentBooking
            doctorChoose={true}
            doctorList={data.doctors}
            onsubmit={handleBooking}
            errorMessage={bookError}
    />
{/if}
