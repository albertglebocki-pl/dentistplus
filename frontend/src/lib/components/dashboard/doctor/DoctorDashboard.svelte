<script lang="ts">
    import { enhance } from "$app/forms";
    import Calendar from "$lib/components/dashboard/utils/Calendar.svelte";
    import AppointmentBooking from "$lib/components/dashboard/utils/AppointmentBooking.svelte";
    import CardTitle from "$lib/components/utils/CardTitle.svelte";
    import Card from "$lib/components/utils/Card.svelte";
    import { page } from "$app/state";
    import UpcomingVisitCard from "$lib/components/dashboard/doctor/UpcomingVisitCard.svelte";
    import ProceduresHistory from "$lib/components/dashboard/utils/ProceduresHistory.svelte";
    import DentalChart from "$lib/components/dashboard/utils/DentalChart.svelte";

    let { data } = $props();
    const visits = $derived(data.data.visits);
    const treatments = $derived(data.treatments);
    const patientVisits = $derived(data.patientVisits);
    const currentView = $derived(page.url.searchParams.get("view") || "main");

    const isSameDay = (date: string) => {
        const d1 = new Date(date);
        const d2 = new Date();
        return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
        );
    };

    const todayVisits = $derived(
        visits.filter((visit: any) => isSameDay(visit.dateTime)),
    );

    const selectedVisitId = $derived(page.url.searchParams.get("id"));
    const selectedVisit = $derived.by(() => {
        return visits.find((v: any) => v._id === selectedVisitId);
    });
    const patient = $derived.by(() => selectedVisit?.patient);

    const inputClass =
        "bg-secondary border border-transparent rounded-lg px-3 py-2.5 text-sm text-primary outline-none focus:border-primary/40 transition-colors";
    const labelClass = "flex flex-col gap-1.5";
    const labelTextClass = "text-primary/60 text-sm";

    type TreatmentDraft = {
        tooth: string;
        catalogItemId: string;
        description: string;
        cost: number;
    };

    let procedures = $state<TreatmentDraft[]>([]);

    const TOOTH_ENUM = [
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "31",
        "32",
        "33",
        "34",
        "35",
        "36",
        "37",
        "38",
        "41",
        "42",
        "43",
        "44",
        "45",
        "46",
        "47",
        "48",
    ];

    let visitDescription = $state("");
    let selectedTooth = $state("");
    let selectedProcedureId = $state<string | null>(null);
    const selectedProcedure = $derived.by(() =>
        procedureCatalog.find((p: any) => p._id === selectedProcedureId),
    );

    let editingIndex = $state<number | null>(null);

    const totalCost = $derived(procedures.reduce((sum, p) => sum + p.cost, 0));

    const visitDraft = $derived.by(() => ({
        patientId: patient?.patientId ?? selectedVisit?.patientId ?? null,
        visitId: selectedVisit?._id ?? null,
        date: new Date(),
        description: visitDescription,
        treatments: procedures,
    }));

    const procedureCatalog = $derived(data.data.catalog);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("pl-PL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const resetForm = () => {
        selectedTooth = "";
        selectedProcedureId = null;
    };

    const handleToothAdd = () => {
        if (!selectedTooth || !selectedProcedure) return;

        const exists = procedures.some(
            (p, i) =>
                p.tooth === selectedTooth &&
                p.catalogItemId === selectedProcedure._id &&
                i !== editingIndex,
        );

        if (exists) return;

        const item: TreatmentDraft = {
            tooth: selectedTooth,
            catalogItemId: selectedProcedure._id,
            description: selectedProcedure.description,
            cost: selectedProcedure.defaultCost,
        };

        if (editingIndex !== null) {
            procedures[editingIndex] = item;
            procedures = [...procedures];
        } else {
            procedures = [...procedures, item];
        }

        editingIndex = null;
        resetForm();
    };

    const handleToothRemove = (index: number) => {
        procedures = procedures.filter((_, i) => i !== index);
    };

    const handleToothEdit = (index: number) => {
        const item = procedures[index];

        selectedTooth = item.tooth;
        selectedProcedureId = item.catalogItemId;

        editingIndex = index;
    };

    const getProcedureName = (procedure: any) => {
        return procedureCatalog.find(
            (p: any) => p._id === procedure.catalogItemId,
        )?.name;
    };

    let updateVisitStatus = $state<{
        message?: string;
        success?: boolean;
    } | null>(null);

    let bookingStatus = $state<{ message?: string; success?: boolean } | null>(null);

    const handleBookingSubmit = () => {
        bookingStatus = null;

        return async ({ result, update }: { result: any; update: any }) => {
            await update();
            if (result.type === "success") {
                bookingStatus = {
                    success: true,
                    message: ""
                };
            } else if (result.type === "failure") {
                bookingStatus = {
                    success: false,
                    message: result.data?.message || "Booking failed"
                };
            }
        };
    };

    let selectedDate: Date | null = $state(null);

    let files: FileList | null = $state(null);
    const file = $derived<File | null>(files?.[0] ?? null);
    let status = $state("");
    let images: any[] = $state([]);
    let loading = $state(false);

    const currentPatientId = $derived(
        patient?.id ?? patient?.patientId ?? selectedVisit?.patientId ?? null,
    );

    async function upload() {
        const currentFile = file;
        if (!currentFile || !currentPatientId) return;

        loading = true;
        status = "Uploading...";

        try {
            const form = new FormData();

            const timestamp = Date.now();

            const extension = currentFile.name.split(".").pop();
            const filename = `patient${currentPatientId}-${timestamp}.${extension}`;

            form.append("file", currentFile, filename);

            const res = await fetch(
                `/api/patients/${currentPatientId}/images`,
                {
                    method: "POST",
                    headers: { Authorization: `Bearer ${data.data.token}` },
                    body: form,
                },
            );

            const data2 = await res.json();
            if (!res.ok) throw new Error(data2.error ?? "Upload failed");

            status = `✅ Uploaded: ${data2.filename}`;
            await loadImages();
            await loadPreviews();
        } catch (e: any) {
            status = `❌ Error: ${e.message}`;
        } finally {
            loading = false;
        }
    }

    async function loadImages() {
        if (!currentPatientId) return;

        loading = true;

        try {
            const res = await fetch(
                `/api/patients/${currentPatientId}/images`,
                {
                    headers: { Authorization: `Bearer ${data.data.token}` },
                },
            );

            const result = await res.json();
            if (!res.ok) throw new Error(result.error ?? "Failed to load");

            images = result;
        } catch (e: any) {
            status = `❌ Error loading images: ${e.message}`;
        } finally {
            loading = false;
        }
    }

    async function loadPreviews() {
        if (!currentPatientId) return;

        const updatedImages = await Promise.all(
            images.map(async (img) => {
                try {
                    const res = await fetch(
                        `/api/patients/${currentPatientId}/images/${img.id}/download`,
                        {
                            headers: {
                                Authorization: `Bearer ${data.data.token}`,
                            },
                        },
                    );

                    if (!res.ok) return img;

                    const blob = await res.blob();
                    const previewUrl = URL.createObjectURL(blob);

                    return { ...img, previewUrl };
                } catch {
                    return img;
                }
            }),
        );

        images = updatedImages;
    }

    async function downloadImage(img: any) {
        if (!currentPatientId) return;

        try {
            const res = await fetch(
                `/api/patients/${currentPatientId}/images/${img.id}/download`,
                {
                    headers: { Authorization: `Bearer ${data.data.token}` },
                },
            );

            if (!res.ok) throw new Error(await res.text());

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = img.filename || "image";
            document.body.appendChild(a);
            a.click();
            a.remove();

            URL.revokeObjectURL(url);
        } catch (e: any) {
            status = `❌ Download error: ${e.message}`;
        }
    }

    async function deleteImage(img: any) {
        if (!currentPatientId) return;

        try {
            const res = await fetch(
                `/api/patients/${currentPatientId}/images/${img.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${data.data.token}`,
                    },
                },
            );

            const result = await res.json();
            if (!res.ok) throw new Error(result.error ?? "Delete failed");

            status = `🗑️ Deleted: ${img.filename}`;
            await loadImages();
            await loadPreviews();
        } catch (e: any) {
            status = `❌ Delete error: ${e.message}`;
        }
    }

    $effect(() => {
        if (currentPatientId) {
            loadImages().then(() => {
                loadPreviews();
            });
        }
    });
</script>

<div class="flex flex-col gap-5 mt-3 h-full">
    {#if currentView === "main"}
        <div class="flex flex-col gap-5 items-stretch h-91 sm:flex-row">
            <Card style={"sm:w-2/3 h-full"}>
                <CardTitle text="Calendar" />
                <Calendar {visits} fullSlots={[]} />
            </Card>

            <Card style={"sm:w-1/3 flex flex-col h-full"}>
                <CardTitle text="Today appointments" />

                <div
                    class="flex-1 h-0 overflow-y-auto flex flex-col gap-3 pr-2"
                >
                    {#each todayVisits.toReversed() as visit}
                        <UpcomingVisitCard {visit} />
                    {:else}
                        <p class="text-sm opacity-50">
                            No appointments for today.
                        </p>
                    {/each}
                </div>
            </Card>
        </div>
    {:else if currentView === "visit"}
        <div class="flex flex-col gap-5 sm:flex-row">
            <Card style={"sm:w-1/3"}>
                <CardTitle text="Patient information" />
                <p class="text-xl pb-2">
                    {patient.firstName}
                    {patient.lastName}
                </p>
                <p>
                    <span class="font-semibold">Email:</span>
                    {patient.email}
                </p>
                <p>
                    <span class="font-semibold">Phone:</span>
                    {patient.phoneNumber}
                </p>
                <p>
                    <span class="font-semibold">Address:</span>
                    {patient.address}
                </p>
            </Card>

            <Card style={"sm:w-2/3 min-h-0"}>
                <CardTitle text="Treatment history" />
                <div class="max-h-62.5 overflow-y-auto min-h-0">
                    <ProceduresHistory procedures={treatments} />
                </div>
            </Card>
        </div>

        <Card style={"w-full"}>
            <CardTitle text="Teeth status" />

            <DentalChart
                procedures={treatments}
                onSelect={(tooth) => {
                    selectedTooth = tooth.label;
                }}
            />
        </Card>

        <Card style={"w-full"}>
            <CardTitle text="Current Visit" />

            <div class="flex flex-col gap-5 sm:flex-row">
                <div class="sm:w-1/3 flex flex-col gap-4">
                    <label class={labelClass}>
                        <span class={labelTextClass}>Visit description</span>
                        <input
                            class={inputClass}
                            bind:value={visitDescription}
                        />
                    </label>

                    <div
                        class="border p-2 border-primary rounded-lg flex flex-col gap-4"
                    >
                        <label class={labelClass}>
                            <span class={labelTextClass}>Tooth</span>
                            <select
                                bind:value={selectedTooth}
                                class={inputClass}
                            >
                                <option value="">-- Select --</option>
                                {#each TOOTH_ENUM as tooth}
                                    <option value={tooth}>{tooth}</option>
                                {/each}
                            </select>
                        </label>

                        <label class={labelClass}>
                            <span class={labelTextClass}>Procedure</span>
                            <select
                                bind:value={selectedProcedureId}
                                class={inputClass}
                            >
                                <option value={null}>-- Select --</option>
                                {#each procedureCatalog as procedure}
                                    <option value={procedure._id}>
                                        {procedure.name}
                                    </option>
                                {/each}
                            </select>
                        </label>

                        <div>
                            <span class={labelTextClass}>Cost</span>
                            <p class="">
                                {#if selectedProcedure}
                                    {selectedProcedure.defaultCost} zł
                                {:else}
                                    Select procedure first
                                {/if}
                            </p>
                        </div>

                        <button
                            type="button"
                            class="bg-primary text-white font-semibold text-sm py-3 rounded-lg mt-2 hover:bg-primary/90 transition-colors"
                            onclick={handleToothAdd}
                        >
                            {editingIndex !== null
                                ? "Update tooth"
                                : "Add tooth"}
                        </button>
                    </div>

                    <form
                        method="POST"
                        class="w-full"
                        action="?/doctorUpdateVisit"
                        use:enhance={() => {
                            updateVisitStatus = null;

                            return async ({ result, update }) => {
                                if (
                                    result.type === "success" ||
                                    result.type === "failure"
                                ) {
                                    updateVisitStatus = (result.data ??
                                        null) as {
                                        message?: string;
                                        success?: boolean;
                                    } | null;
                                }

                                update({ reset: false });
                            };
                        }}
                    >
                        <input
                            type="hidden"
                            name="payload"
                            value={JSON.stringify(visitDraft)}
                        />

                        {#if updateVisitStatus?.message}
                            <div
                                class="bg-red-50 text-red-600 p-3 rounded-lg text-sm mt-2 border border-red-100"
                            >
                                {updateVisitStatus.message}
                            </div>
                        {/if}

                        {#if updateVisitStatus?.success}
                            <div
                                class="bg-green-50 text-green-600 p-3 rounded-lg text-sm mt-2 border border-green-100"
                            >
                                Saved!
                            </div>
                        {/if}

                        <button
                            class="bg-primary text-white font-semibold text-sm py-3 rounded-lg mt-2 hover:bg-primary/90 transition-colors w-full"
                        >
                            Save
                        </button>
                    </form>
                </div>

                <div class="sm:w-2/3">
                    <h2 class="pb-3 text-primary/60">Summary</h2>

                    <div
                        class="bg-secondary border border-primary rounded-lg p-4"
                    >
                        <div class="flex justify-between mb-3">
                            <p class="w-1/4">{formatDate(new Date())}</p>
                            <p class="font-semibold text-xl">
                                {visitDescription ||
                                    "Enter visit description..."}
                            </p>
                            <p class="w-1/4 flex justify-end">
                                {totalCost} zł
                            </p>
                        </div>

                        <div class="flex flex-col gap-3">
                            {#each procedures as procedure, i}
                                <div
                                    class="flex justify-between items-center p-2 border-t"
                                >
                                    <p class="w-1/4">Tooth {procedure.tooth}</p>
                                    <p class="flex-1">
                                        {getProcedureName(procedure)}
                                    </p>
                                    <p class="w-1/4 flex justify-end">
                                        {procedure.cost} zł
                                    </p>

                                    <div class="flex gap-2 ml-3">
                                        <button
                                            type="button"
                                            class="text-xs px-2 py-1 rounded bg-primary text-white hover:bg-primary/80 transition-colors"
                                            onclick={() => handleToothEdit(i)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            class="text-xs px-2 py-1 rounded bg-primary text-white hover:bg-primary/80 transition-colors"
                                            onclick={() => handleToothRemove(i)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            {:else}
                                <p class="text-center mt-3">
                                    Nothing to show here. Add tooth procedure
                                    first...
                                </p>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        </Card>

        <Card style={"w-full"}>
            <CardTitle text="Book next appointment" />

            <div class="flex flex-col justify-between sm:flex-row">
                <div class="sm:w-1/3">
                    <AppointmentBooking
                        doctorChoose={false}
                        patientId={patient.id}
                        error={bookingStatus?.success === false ? bookingStatus.message : ""}
                        success={bookingStatus?.success === true ? "Success" : ""}
                        submitHandler={handleBookingSubmit}
                        {selectedDate}
                    />
                </div>

                <div class="sm:w-2/3">
                    <Calendar
                        visits={patientVisits}
                        fullSlots={data.data.visits}
                        {selectedDate}
                        onSelect={(date: Date) => (selectedDate = date)}
                    />
                </div>
            </div>
        </Card>

        <Card style={"w-full mb-5"}>
            <CardTitle text="Patient images" />

            <div class="flex flex-col gap-5 sm:flex-row">
                <div class="sm:w-1/3 flex flex-col gap-4">
                    <div
                        class="border border-primary/20 rounded-xl p-4 bg-secondary flex flex-col gap-4"
                    >
                        <div>
                            <h3 class="font-semibold">Upload image</h3>
                            <p class="text-xs opacity-60">
                                Add new patient photo or scan
                            </p>
                        </div>

                        <input type="file" class={inputClass} bind:files />

                        <button
                            type="button"
                            class="bg-primary text-white font-semibold text-sm py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                            onclick={upload}
                            disabled={loading || !file}
                        >
                            {loading ? "Uploading..." : "Upload image"}
                        </button>

                        {#if status}
                            <p class="text-sm opacity-70">{status}</p>
                        {/if}
                    </div>
                </div>

                <div class="sm:w-2/3">
                    <div
                        class="border border-primary/20 rounded-xl p-4 bg-secondary h-80 overflow-y-auto"
                    >
                        {#if images.length === 0}
                            <p class="text-sm opacity-50 text-center mt-10">
                                Nothing to see.
                            </p>
                        {:else}
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {#each images as img}
                                    <div
                                        class="border rounded-lg p-2 flex flex-col gap-2 bg-white"
                                    >
                                        {#if img.previewUrl}
                                            <img
                                                src={img.previewUrl}
                                                alt={img.filename}
                                                class="w-full h-32 object-cover rounded"
                                                draggable="false"
                                            />
                                        {/if}

                                        <p class="text-xs truncate">
                                            {img.filename}
                                        </p>

                                        <div class="flex gap-2">
                                            <button
                                                type="button"
                                                class="text-xs px-2 py-1 rounded bg-primary text-white"
                                                onclick={() =>
                                                    downloadImage(img)}
                                            >
                                                Download
                                            </button>

                                            <button
                                                type="button"
                                                class="text-xs px-2 py-1 rounded bg-red-500 text-white"
                                                onclick={() => deleteImage(img)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
        </Card>
    {/if}
</div>
