<script lang="ts">
    import type { PageData } from "./$types";
    import AdminDashboard from "$lib/components/dashboard/admin/AdminDashboard.svelte";

    const { data }: { data: PageData } = $props();
</script>

<AdminDashboard user={data.user} token={data.token} />
