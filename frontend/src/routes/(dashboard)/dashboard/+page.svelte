<script lang="ts">
    import type { PageData } from "./$types";

    import AdminDashboard from "$lib/components/dashboard/AdminDashboard.svelte";
    import DoctorDashboard from "$lib/components/dashboard/DoctorDashboard.svelte";
    import PatientDashboard from "$lib/components/dashboard/PatientDashboard.svelte";

    const { data }: { data: PageData } = $props();
</script>

<main>
    <div class="max-w-5xl mx-auto">
        {#if data.user.role === "ADMIN"}
            <AdminDashboard />
        {:else if data.user.role === "DOCTOR"}
            <DoctorDashboard />
        {:else}
            <PatientDashboard />
        {/if}
    </div>
</main>
