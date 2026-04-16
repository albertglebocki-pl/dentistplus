<script>
    let { selectedTooth = $bindable() } = $props();
    const teeth = Array.from({ length: 32 }, (_, i) => i + 1);
</script>

<div class="grid grid-cols-8 gap-2">
    {#each teeth as t}
        <button
            on:click={() => (selectedTooth = t)}
            class="h-10 border rounded
      ${selectedTooth === t ? 'bg-accent text-white' : 'bg-secondary'}"
        >
            {t}
        </button>
    {/each}
</div>
