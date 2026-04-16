<script lang="ts">
    type Patient = {
        id: number;
        firstName: string | null;
        lastName: string | null;
        active: boolean;
    };

    const { patients }: { patients: Patient[] } = $props();
</script>

<div class="bg-white border rounded-xl p-4">
    <h2 class="font-semibold mb-3 text-primary">Patients</h2>

    {#each patients as p}
        <div class="flex justify-between py-2 border-b">
            <span>
                {p.firstName ?? ""}
                {p.lastName ?? ""}
            </span>

            <button class="text-xs px-2 py-1 bg-red-100 text-red-600 rounded">
                {p.active ? "active" : "blocked"}
            </button>
        </div>
    {/each}
</div>
