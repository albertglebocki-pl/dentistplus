<script>
    let doctors = [
        { name: "Dr Smith", status: "active" },
        { name: "Dr Adams", status: "blocked" },
    ];
</script>

<div class="bg-white border rounded-xl p-4">
    <h2 class="font-semibold mb-3 text-primary">Doctors</h2>

    {#each doctors as d}
        <div class="flex justify-between py-2 border-b">
            <span>{d.name}</span>
            <button class="text-xs px-2 py-1 bg-red-100 text-red-600 rounded">
                {d.status}
            </button>
        </div>
    {/each}
</div>
