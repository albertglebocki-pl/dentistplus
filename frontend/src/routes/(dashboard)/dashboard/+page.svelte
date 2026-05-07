<script lang="ts">
    import type { PageData } from "./$types";
    import type { ActionData } from "../../../../.svelte-kit/types/src/routes/(auth)/auth/login/$types";

    import AdminDashboard from "$lib/components/dashboard/admin/AdminDashboard.svelte";
    import DoctorDashboard from "$lib/components/dashboard/doctor/DoctorDashboard.svelte";
    import UserDashboard from "$lib/components/dashboard/user/UserDashboard.svelte";

    let { data, form }: { data: PageData; form: ActionData } = $props();

    const role = $derived(data.user.role);
</script>

{#if role === "ADMIN"}
    <AdminDashboard {data} />
{:else if role === "USER"}
    <UserDashboard {data} {form} />
{:else}
    <DoctorDashboard {data} />
{/if}
