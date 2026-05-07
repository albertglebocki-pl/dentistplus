<script lang="ts">
    let {children, style} = $props();
</script>

<div class='bg-white p-3 rounded-lg {style}'>
    {@render children()}
</div>