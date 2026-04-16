<script lang="ts">
    let {
        doctorChoose = true,
        doctorList = [],
        onsubmit,
        errorMessage = $bindable(""),
    } = $props();

    let doctorId = $state(null);
    let datetime = $state("");
    let description = $state("");

    function handleSubmit(e) {
        e.preventDefault();
        onsubmit?.({ doctorId, datetime, description });
    }
</script>

<form onsubmit={handleSubmit} class="flex flex-col gap-3">
    <input
        class="p-2 border rounded"
        type="datetime-local"
        bind:value={datetime}
    />
    <input
        class="p-2 border rounded"
        type="text"
        placeholder="description"
        bind:value={description}
    />

    <button class="bg-primary text-white py-2 rounded"> Book </button>
</form>
