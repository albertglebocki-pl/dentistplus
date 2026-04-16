<script>
    let { color = "primary" } = $props();
</script>

<span
    class={`text-xs px-2 py-1 rounded-full bg-${color}-100 text-${color}-700`}
>
    <slot />
</span>
