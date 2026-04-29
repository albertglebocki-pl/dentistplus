<script lang="ts">
    type ToothId =
        | "11"
        | "12"
        | "13"
        | "14"
        | "15"
        | "16"
        | "17"
        | "18"
        | "21"
        | "22"
        | "23"
        | "24"
        | "25"
        | "26"
        | "27"
        | "28"
        | "31"
        | "32"
        | "33"
        | "34"
        | "35"
        | "36"
        | "37"
        | "38"
        | "41"
        | "42"
        | "43"
        | "44"
        | "45"
        | "46"
        | "47"
        | "48";

    type ToothType =
        | "central"
        | "lateral"
        | "canine"
        | "premolar1"
        | "premolar2"
        | "molar1"
        | "molar2"
        | "molar3";

    type Tooth = {
        id: number;
        label: ToothId;
        quadrant: 1 | 2 | 3 | 4;
        arch: "maxilla" | "mandible";
        description: string;
        toothType: ToothType;
    };

    const TOOTH_META: Record<ToothId, { name: string; toothType: ToothType }> =
        {
            "11": { name: "Central Incisor", toothType: "central" },
            "12": { name: "Lateral Incisor", toothType: "lateral" },
            "13": { name: "Canine", toothType: "canine" },
            "14": { name: "First Premolar", toothType: "premolar1" },
            "15": { name: "Second Premolar", toothType: "premolar2" },
            "16": { name: "First Molar", toothType: "molar1" },
            "17": { name: "Second Molar", toothType: "molar2" },
            "18": { name: "Third Molar", toothType: "molar3" },
            "21": { name: "Central Incisor", toothType: "central" },
            "22": { name: "Lateral Incisor", toothType: "lateral" },
            "23": { name: "Canine", toothType: "canine" },
            "24": { name: "First Premolar", toothType: "premolar1" },
            "25": { name: "Second Premolar", toothType: "premolar2" },
            "26": { name: "First Molar", toothType: "molar1" },
            "27": { name: "Second Molar", toothType: "molar2" },
            "28": { name: "Third Molar", toothType: "molar3" },
            "31": { name: "Central Incisor", toothType: "central" },
            "32": { name: "Lateral Incisor", toothType: "lateral" },
            "33": { name: "Canine", toothType: "canine" },
            "34": { name: "First Premolar", toothType: "premolar1" },
            "35": { name: "Second Premolar", toothType: "premolar2" },
            "36": { name: "First Molar", toothType: "molar1" },
            "37": { name: "Second Molar", toothType: "molar2" },
            "38": { name: "Third Molar", toothType: "molar3" },
            "41": { name: "Central Incisor", toothType: "central" },
            "42": { name: "Lateral Incisor", toothType: "lateral" },
            "43": { name: "Canine", toothType: "canine" },
            "44": { name: "First Premolar", toothType: "premolar1" },
            "45": { name: "Second Premolar", toothType: "premolar2" },
            "46": { name: "First Molar", toothType: "molar1" },
            "47": { name: "Second Molar", toothType: "molar2" },
            "48": { name: "Third Molar", toothType: "molar3" },
        };

    const TOOTH_ENUM: ToothId[] = [
        "18",
        "17",
        "16",
        "15",
        "14",
        "13",
        "12",
        "11",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "48",
        "47",
        "46",
        "45",
        "44",
        "43",
        "42",
        "41",
        "31",
        "32",
        "33",
        "34",
        "35",
        "36",
        "37",
        "38",
    ];

    const teeth: Tooth[] = TOOTH_ENUM.map((label, i) => {
        const q = Number(label[0]) as 1 | 2 | 3 | 4;
        const meta = TOOTH_META[label];

        return {
            id: i + 1,
            label,
            quadrant: q,
            arch: q <= 2 ? "maxilla" : "mandible",
            description: `${meta.name} — FDI ${label}, Quadrant ${q}`,
            toothType: meta.toothType,
        };
    });

    let selectedTooth = $state<Tooth | null>(null);

    const { onSelect } = $props<{ onSelect?: (tooth: Tooth) => void }>();

    function selectTooth(tooth: Tooth) {
        if (selectedTooth?.id === tooth.id) {
            selectedTooth = null;
            return;
        }
        selectedTooth = tooth;
        onSelect?.(tooth);
    }

    const UR = $derived(teeth.filter((t) => t.quadrant === 1));
    const UL = $derived(teeth.filter((t) => t.quadrant === 2));
    const LR = $derived(teeth.filter((t) => t.quadrant === 4));
    const LL = $derived(teeth.filter((t) => t.quadrant === 3));

    function archScale(i: number, total: number) {
        const center = (total - 1) / 2;
        if (center === 0) return 1;
        const dist = Math.abs(i - center) / center;
        return 1.25 + dist * 0.25;
    }
</script>

{#snippet toothShape(tooth: Tooth, lower: boolean)}
    {@const sel = selectedTooth?.id === tooth.id}

    <svg viewBox="0 0 40 90" class="w-8 h-18">
        <g transform={lower ? "scale(1,-1) translate(0,-90)" : ""}>
            <path
                d="M20 6 C10 6, 6 18, 8 30 C10 44, 8 58, 12 72 C14 82, 26 82, 28 72 C32 58, 30 44, 32 30 C34 18, 30 6, 20 6 Z"
                class={sel
                    ? "fill-primary/30 stroke-primary"
                    : "fill-stone-100 stroke-stone-300"}
                stroke-width="1.2"
            />
            <path
                d="M20 14 L20 74"
                class="stroke-stone-300/60"
                stroke-width="1.2"
            />
        </g>
    </svg>
{/snippet}

{#snippet toothButton(tooth: Tooth, lower: boolean, i: number, total: number)}
    {@const scale = archScale(i, total)}

    <button
        type="button"
        class="flex flex-col items-center focus:outline-none"
        style={`transform: scale(${scale});`}
        onclick={() => selectTooth(tooth)}
    >
        {#if lower}
            <span class="text-[9px] text-gray-400">{tooth.label}</span>
            {@render toothShape(tooth, true)}
        {:else}
            {@render toothShape(tooth, false)}
            <span class="text-[9px] text-gray-400">{tooth.label}</span>
        {/if}
    </button>
{/snippet}

<div class="flex justify-center items-center py-5 gap-16">
    <div class="flex flex-col items-center gap-2">
        <div class="flex items-end min-h-32">
            <div class="flex items-end">
                {#each UR as tooth, i}
                    {@render toothButton(tooth, false, i, UR.length)}
                {/each}
            </div>
            <div class="flex items-end">
                {#each UL as tooth, i}
                    {@render toothButton(tooth, false, i, UL.length)}
                {/each}
            </div>
        </div>

        <div class="h-6"></div>

        <div class="flex items-start min-h-32">
            <div class="flex items-end">
                {#each LR as tooth, i}
                    {@render toothButton(tooth, true, i, LR.length)}
                {/each}
            </div>
            <div class="flex items-end">
                {#each LL as tooth, i}
                    {@render toothButton(tooth, true, i, LL.length)}
                {/each}
            </div>
        </div>
    </div>

    <div class="w-64">
        <div
            class="px-4 py-3 rounded-lg border border-primary/20 bg-primary/10 flex flex-col gap-2 min-h-22"
        >
            {#if selectedTooth}
                <span class="font-bold text-primary">{selectedTooth.label}</span
                >
                <span class="text-sm font-medium text-gray-700">
                    {TOOTH_META[selectedTooth.label].name}
                </span>
                <span class="text-xs text-gray-500">
                    {selectedTooth.description}
                </span>
            {:else}
                <span class="font-medium text-gray-700">Nothing to see</span>
                <span class="text-xs text-gray-500">Select a tooth</span>
            {/if}
        </div>
    </div>
</div>
