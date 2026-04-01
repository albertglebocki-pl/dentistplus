<script lang="ts">
    import "../layout.css";
    import favicon from "$lib/assets/favicon.svg";

    const currentYear = new Date().getFullYear();

    let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
    <title>Dentist+ | Auth</title>
</svelte:head>

{@render children()}
