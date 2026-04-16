<script>
    let { selectedTooth } = $props();
</script>

<div class="bg-white border rounded-xl p-4">
    <h2 class="font-semibold text-primary">Tooth</h2>

    {#if selectedTooth}
        <p>{selectedTooth}</p>
    {:else}
        <p class="text-primary/40">Select tooth</p>
    {/if}
</div>
