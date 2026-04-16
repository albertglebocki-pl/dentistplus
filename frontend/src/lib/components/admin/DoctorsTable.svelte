<script lang="ts">
    type Doctor = {
        id: number;
        firstName: string | null;
        lastName: string | null;
        active: boolean;
    };

    const { doctors }: { doctors: Doctor[] } = $props();
</script>

<div class="bg-white border rounded-xl p-4">
    <h2 class="font-semibold mb-3 text-primary">Doctors</h2>

    {#each doctors as d}
        <div class="flex justify-between py-2 border-b">
            <span>
                {d.firstName ?? ""}
                {d.lastName ?? ""}
            </span>

            <button class="text-xs px-2 py-1 bg-red-100 text-red-600 rounded">
                {d.active ? "active" : "blocked"}
            </button>
        </div>
    {/each}
</div>
