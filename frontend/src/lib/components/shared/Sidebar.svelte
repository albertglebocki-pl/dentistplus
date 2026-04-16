<script>
    let { items = [] } = $props();
</script>

<aside
    class="w-20 bg-white border-r h-screen flex flex-col items-center py-4 gap-6"
>
    <div class="w-10 h-10 rounded-xl bg-primary"></div>

    {#each items as item}
        <button
            class="w-10 h-10 rounded-xl bg-secondary hover:bg-accent hover:text-white transition"
        >
            {item.icon}
        </button>
    {/each}
</aside>
