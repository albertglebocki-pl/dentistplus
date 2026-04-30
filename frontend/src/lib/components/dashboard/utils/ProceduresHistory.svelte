<script lang="ts">
    let { procedures, folded = false } = $props();

    let expandedTreatmentId = $state<string | null>(null);

    const calculateTotalCost = (treatments: any) => {
        return treatments.reduce((sum: any, treatment: any) => {
            return sum + (treatment.cost || 0);
        }, 0);
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("pl-PL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const toggleDetails = (id: string) => {
        expandedTreatmentId = expandedTreatmentId === id ? null : id;
    };
</script>

{#if procedures.length > 0}
    <div class="flex flex-col gap-3">
        {#each procedures as treatment}
            <div class="bg-secondary border border-primary rounded-lg p-2">
                {#if folded}
                    <div class="flex items-center justify-between">
                        <p class="text-sm">
                            {formatDate(new Date(treatment.date))}
                        </p>

                        <p class="font-semibold">
                            {treatment.description}
                        </p>
                    </div>

                    <div class="flex items-center justify-between mt-2">
                        <p>
                            Total cost:
                            {calculateTotalCost(treatment.treatments)} zł
                        </p>

                        <div class="flex justify-end">
                            <button
                                type="button"
                                class="bg-primary text-white font-semibold text-sm py-1 px-2 rounded-lg hover:bg-primary/90 transition-colors"
                                onclick={() => toggleDetails(treatment._id)}
                            >
                                {expandedTreatmentId === treatment._id
                                    ? "Hide"
                                    : "Details"}
                            </button>
                        </div>
                    </div>
                {:else}
                    <div class="flex items-center justify-between">
                        <p class="w-1/10 text-sm">
                            {formatDate(new Date(treatment.date))}
                        </p>

                        <p class="w-1/3 font-semibold">
                            {treatment.description}
                        </p>

                        <p class="w-1/4 text-right">
                            Total cost:
                            {calculateTotalCost(treatment.treatments)} zł
                        </p>

                        <div class="w-1/10 flex justify-end">
                            <button
                                type="button"
                                class="bg-primary text-white font-semibold text-sm py-1 px-2 rounded-lg hover:bg-primary/90 transition-colors"
                                onclick={() => toggleDetails(treatment._id)}
                            >
                                {expandedTreatmentId === treatment._id
                                    ? "Hide"
                                    : "Details"}
                            </button>
                        </div>
                    </div>
                {/if}

                {#if expandedTreatmentId === treatment._id}
                    <div class="mt-3">
                        {#each treatment.treatments as t}
                            {#if folded}
                                <div class="flex flex-col p-2 border-t">
                                    <p>{t.catalogItemId.name}</p>
                                    <div class="flex justify-between">
                                        <p class="text-sm">Tooth: {t.tooth}</p>
                                        <p class="text-sm">{t.cost} zł</p>
                                    </div>
                                </div>
                            {:else}
                                <div
                                    class="flex justify-between items-center p-2 border-t"
                                >
                                    <p class="text-sm">Tooth: {t.tooth}</p>
                                    <p>{t.catalogItemId.name}</p>
                                    <p class="text-sm">{t.cost} zł</p>
                                </div>
                            {/if}
                        {/each}
                    </div>
                {/if}
            </div>
        {/each}
    </div>
{:else}
    <p>No treatment history</p>
{/if}
