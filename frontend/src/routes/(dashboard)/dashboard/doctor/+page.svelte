<script lang="ts">
    import type { PageData } from "./$types";
    import DoctorDashboard from "$lib/components/dashboard/doctor/DoctorDashboard.svelte";

    const { data }: { data: PageData } = $props();
</script>

<DoctorDashboard user={data.user} />
