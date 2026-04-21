<script lang="ts">
    import type { PageData } from "./$types";

    const { data }: { data: PageData } = $props();
</script>

<main>DASHBOARD</main>
<p>{data.user.role}</p>