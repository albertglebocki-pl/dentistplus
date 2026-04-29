<script lang="ts">
    import {enhance} from "$app/forms";
    import Calendar from "$lib/components/dashboard/utils/Calendar.svelte";
    import AppointmentBooking from "$lib/components/dashboard/utils/AppointmentBooking.svelte";
    import CardTitle from "$lib/components/utils/CardTitle.svelte";
    import Card from "$lib/components/utils/Card.svelte";
    import {page} from "$app/state";
    import {goto} from "$app/navigation";
    import UpcomingVisitCard from "$lib/components/dashboard/doctor/UpcomingVisitCard.svelte";
    import ProceduresHistory from "$lib/components/dashboard/utils/ProceduresHistory.svelte";

    let {data, form} = $props();
    const visits = $derived(data.data.visits);
    const treatments = $derived(data.treatments);
    const patientVisits = $derived(data.patientVisits);
    const currentView = $derived(page.url.searchParams.get('view') || 'main');

    const isSameDay = (date: string) => {
        const d1 = new Date(date);
        const d2 = new Date();
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }

    const todayVisits = $derived(visits.filter(visit => isSameDay(visit.dateTime)));

    const selectedVisitId = $derived(page.url.searchParams.get('id'));
    const selectedVisit = $derived.by(() => {
        return visits.find(v => v._id === selectedVisitId);
    });
    const patient = $derived.by(() => selectedVisit?.patient);

    const inputClass = "bg-secondary border border-transparent rounded-lg px-3 py-2.5 text-sm text-primary outline-none focus:border-primary/40 transition-colors";
    const labelClass = "flex flex-col gap-1.5";
    const labelTextClass = "text-primary/60 text-sm";

    type TreatmentDraft = {
        tooth: string;
        catalogItemId: string;
        description: string;
        cost: number;
    };

    let procedures = $state<TreatmentDraft[]>([]);

    const TOOTH_ENUM = ["11", "12", "13", "14", "15", "16", "17", "18", "21", "22", "23", "24", "25", "26", "27", "28", "31", "32", "33", "34", "35", "36", "37", "38", "41", "42", "43", "44", "45", "46", "47", "48"];

    let visitDescription = $state("");
    let selectedTooth = $state("");
    let selectedProcedureId = $state<string | null>(null);
    const selectedProcedure = $derived.by(() =>
        procedureCatalog.find(p => p._id === selectedProcedureId)
    );

    let editingIndex = $state<number | null>(null);

    const totalCost = $derived(
        procedures.reduce((sum, p) => sum + p.cost, 0)
    );

    const visitDraft = $derived.by(() => ({
        patientId: patient?.patientId ?? selectedVisit?.patientId ?? null,
        visitId: selectedVisit?._id ?? null,
        date: new Date(),
        description: visitDescription,
        treatments: procedures
    }));

    const procedureCatalog = data.data.catalog;

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('pl-PL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    const resetForm = () => {
        selectedTooth = "";
        selectedProcedureId = null;
    };

    const handleToothAdd = () => {
        if (!selectedTooth || !selectedProcedure) return;

        const item: TreatmentDraft = {
            tooth: selectedTooth,
            catalogItemId: selectedProcedure._id,
            description: selectedProcedure.description,
            cost: selectedProcedure.defaultCost
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

    const getProcedureName = (procedure) => {
        return procedureCatalog.find(p => p._id === procedure.catalogItemId)?.name;
    };

    let updateVisitStatus = $state<{ message?: string, success?: boolean } | null>(null);
    let bookingStatus = $state<{ message?: string, success?: boolean } | null>(null);

    const handleBookingSubmit: SubmitFunction = () => {
        bookingStatus = null;

        return async ({result, update}) => {
            if (result.type === 'success' || result.type === 'failure') {
                bookingStatus = result.data as { message?: string, success?: boolean };
            }
            await update();
        };
    };
</script>

<div class="flex flex-col gap-5 mt-3 h-full">
    {#if currentView === 'main'}
        <div class="flex gap-5 items-stretch h-91">

            <Card style={"w-2/3 h-full"}>
                <CardTitle text="Calendar"/>
                <Calendar visits={visits} fullSlots={[]}/>
            </Card>

            <Card style={"w-1/3 flex flex-col h-full"}>
                <CardTitle text="Today appointments"/>

                <div class="flex-1 h-0 overflow-y-auto flex flex-col gap-3 pr-2">
                    {#each todayVisits.toReversed() as visit}
                        <UpcomingVisitCard {visit}/>
                    {:else}
                        <p class="text-sm opacity-50">No appointments for today.</p>
                    {/each}
                </div>
            </Card>
        </div>

    {:else if currentView === 'visit'}
        <div class="flex gap-5">
            <Card style={"w-1/3"}>
                <CardTitle text="Patient information"/>
                <p class="text-xl pb-2">{patient.firstName} {patient.lastName}</p>
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

            <Card style={"w-2/3 min-h-0"}>
                <CardTitle text="Treatment history"/>
                <div class="max-h-[250px] overflow-y-auto min-h-0">
                    <ProceduresHistory procedures={treatments}/>
                </div>
            </Card>
        </div>

        <Card style={"w-full"}>
            <CardTitle text="Teeth status TODO"/>
        </Card>

        <Card style={"w-full"}>
            <CardTitle text="Current Visit"/>

            <div class="flex gap-5">
                <div class="w-1/3 flex flex-col gap-4">
                    <label class={labelClass}>
                        <span class={labelTextClass}>Visit description</span>
                        <input class={inputClass} bind:value={visitDescription}/>
                    </label>

                    <div class="border p-2 border-primary rounded-lg flex flex-col gap-4">

                        <label class={labelClass}>
                            <span class={labelTextClass}>Tooth</span>
                            <select bind:value={selectedTooth} class={inputClass}>
                                <option value="">-- Select --</option>
                                {#each TOOTH_ENUM as tooth}
                                    <option value={tooth}>{tooth}</option>
                                {/each}
                            </select>
                        </label>

                        <label class={labelClass}>
                            <span class={labelTextClass}>Procedure</span>
                            <select bind:value={selectedProcedureId} class={inputClass}>
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
                                on:click={handleToothAdd}
                        >
                            {editingIndex !== null ? "Update tooth" : "Add tooth"}
                        </button>
                    </div>

                    <form
                            method="POST"
                            class="w-full"
                            action="?/doctorUpdateVisit"
                            use:enhance={() => {
                                updateVisitStatus = null;

                                return async({result, update}) => {
                                    if(result.type === 'success' || result.type === 'failure') {
                                        updateVisitStatus = result.data;
                                    }

                                    update({reset: false});
                                }
                            }}
                    >
                        <input type="hidden" name="payload" value={JSON.stringify(visitDraft)}/>

                        {#if updateVisitStatus?.message}
                            <div class="bg-red-50 text-red-600 p-3 rounded-lg text-sm mt-2 border border-red-100">
                                {updateVisitStatus.message}
                            </div>
                        {/if}

                        {#if updateVisitStatus?.success}
                            <div class="bg-green-50 text-green-600 p-3 rounded-lg text-sm mt-2 border border-green-100">
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

                <div class="w-2/3">
                    <h2 class="pb-3 text-primary/60">Summary</h2>

                    <div class="bg-secondary border border-primary rounded-lg p-4">

                        <div class="flex justify-between mb-3">
                            <p class="w-1/4">{formatDate(new Date())}</p>
                            <p class="font-semibold text-xl">
                                {visitDescription || "Enter visit description..."}
                            </p>
                            <p class="w-1/4 flex justify-end">
                                {totalCost} zł
                            </p>
                        </div>

                        <div class="flex flex-col gap-3">
                            {#each procedures as procedure, i}
                                <div class="flex justify-between items-center p-2 border-t">

                                    <p class="w-1/4">Tooth {procedure.tooth}</p>
                                    <p class="flex-1">{getProcedureName(procedure)}</p>
                                    <p class="w-1/4 flex justify-end">{procedure.cost} zł</p>

                                    <div class="flex gap-2 ml-3">
                                        <button
                                                type="button"
                                                class="text-xs px-2 py-1 rounded bg-primary text-white hover:bg-primary/80 transition-colors"
                                                on:click={() => handleToothEdit(i)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                                type="button"
                                                class="text-xs px-2 py-1 rounded bg-primary text-white hover:bg-primary/80 transition-colors"
                                                on:click={() => handleToothRemove(i)}
                                        >
                                            Remove
                                        </button>
                                    </div>

                                </div>
                            {:else}
                                <p class="text-center mt-3">
                                    Nothing to show here. Add tooth procedure first...
                                </p>
                            {/each}
                        </div>

                    </div>
                </div>
            </div>
        </Card>

        <Card style={"w-full mb-5"}>
            <CardTitle text="Book next appointment"/>

            <div class="flex justify-between">
                <div class="w-1/3">
                    <AppointmentBooking
                            doctorChoose={false}
                            patientId={patient.id}
                            error={bookingStatus?.message}
                            success={bookingStatus?.success}
                            submitHandler={handleBookingSubmit}
                    />
                </div>

                <div class="w-2/3">
                    <Calendar
                            visits={patientVisits}
                            fullSlots={data.data.visits}
                    />
                </div>
            </div>
        </Card>
    {/if}
</div>
