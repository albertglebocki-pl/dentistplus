<script lang="ts">
    import './layout.css';
    import favicon from '$lib/assets/favicon.svg';

    let {children} = $props();

    // TODO
    // Test endpoint call, should be removed later
    import {onMount} from "svelte";

    let data;

    onMount(async () => {
        const res = await fetch("/api/test");
        data = await res.json();
        console.log(data)
    });
    //=================================

</script>

<svelte:head>
    <link rel="icon" href={favicon}/>
</svelte:head>
{@render children()}
