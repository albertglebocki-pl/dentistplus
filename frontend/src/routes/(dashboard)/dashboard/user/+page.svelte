<script lang="ts">
    import type { PageData } from "./$types";
    import UserDashboard from "$lib/components/dashboard/user/UserDashboard.svelte";

    const { data }: { data: PageData } = $props();
</script>

<UserDashboard user={data.user} />
