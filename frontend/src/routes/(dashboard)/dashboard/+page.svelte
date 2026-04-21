<script lang="ts">
    import type { PageData } from "./$types";

    const { data }: { data: PageData } = $props();
    const role = data.user.role;

    import AdminDashboard from "$lib/components/dashboard/admin/AdminDashboard.svelte";
    import DoctorDashboard from "$lib/components/dashboard/doctor/DoctorDashboard.svelte";
    import UserDashboard from "$lib/components/dashboard/user/UserDashboard.svelte";
</script>

{#if role === "ADMIN"}
    <AdminDashboard user={data.user}/>
{:else if role === "USER"}
    <UserDashboard user={data.user}/>
{:else}
    <DoctorDashboard user={data.user}/>
{/if}