<script lang="ts">
    import { page } from "$app/state";
    import { goto } from "$app/navigation";

    import Calendar from "$lib/components/dashboard/utils/Calendar.svelte";
    import AppointmentBooking from "$lib/components/dashboard/utils/AppointmentBooking.svelte";
    import CardTitle from "$lib/components/utils/CardTitle.svelte";
    import Card from "$lib/components/utils/Card.svelte";
    import DentalChart from "../utils/DentalChart.svelte";
    import ProceduresHistory from "$lib/components/dashboard/utils/ProceduresHistory.svelte";

    let { data, form } = $props();

    const currentView = $derived(page.url.searchParams.get("view") || "main");
    const procedures = $derived(data.data.procedures);
    const payments = $derived(data.data.payments);

    let selectedDate: Date | null = $state(null);

    const images = $derived(data.data.images ?? []);

    const onBooking = (e: any) => {
        e.preventDefault();
        goto("?view=booking", { noScroll: true });
    };

    function handleDoctorChange(id: string) {
        const newUrl = new URL(page.url);
        if (id) {
            newUrl.searchParams.set("doctorId", id);
        } else {
            newUrl.searchParams.delete("doctorId");
        }
        goto(newUrl.href, {
            keepFocus: true,
            noScroll: true,
            replaceState: true,
        });
    }
</script>

<div class="flex flex-col gap-5 mt-3">
    {#if currentView === "main"}
        <div class="flex flex-col gap-5 sm:flex-row">
            <Card style={"sm:w-2/3"}>
                <div class="flex justify-between items-start pb-5">
                    <CardTitle text="Calendar" />
                    <button
                        onclick={onBooking}
                        class="bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors px-2 py-2"
                    >
                        Book appointment
                    </button>
                </div>

                <Calendar visits={data.data.visits} fullSlots={[]} />
            </Card>

            <Card style={"sm:w-1/3"}>
                <CardTitle text="Payments" />
                <div class="max-h-77.5 overflow-y-auto min-h-0">
                    <ProceduresHistory {procedures} {payments} folded />
                </div>
            </Card>
        </div>

        <Card style={"full"}>
            <CardTitle text="Tooth" />

            <DentalChart procedures={procedures}/>
        </Card>

        <Card style={"full"}>
            <CardTitle text="My images" />

            {#if images.length === 0}
                <p class="text-sm opacity-60">Nothing to see.</p>
            {:else}
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {#each images as img}
                        <div
                            class="bg-secondary border rounded-lg p-2 flex flex-col gap-2"
                        >
                            {#if img.previewUrl}
                                <img
                                    src={img.previewUrl}
                                    alt={img.filename}
                                    class="w-full h-32 object-cover rounded"
                                    draggable="false"
                                />
                            {:else}
                                <div
                                    class="w-full h-32 flex items-center justify-center text-xs opacity-50"
                                >
                                    No preview
                                </div>
                            {/if}

                            <p class="text-xs truncate">{img.filename}</p>

                            <a
                                href={img.previewUrl}
                                download={img.filename}
                                class="text-xs text-center bg-primary text-white rounded py-1 hover:bg-primary/90 transition-colors"
                            >
                                Download
                            </a>
                        </div>
                    {/each}
                </div>
            {/if}
        </Card>
    {/if}

    {#if currentView === "booking"}
        <Card style={"full"}>
            <CardTitle text="Book appointment" />
            <div class="flex flex-col justify-between sm:flex-row">
                <div class="sm:w-1/3">
                    <AppointmentBooking
                        doctorChoose
                        doctorList={data.data.doctors}
                        error={form?.message}
                        success={form?.success}
                        onDoctorChange={handleDoctorChange}
                        {selectedDate}
                    />
                </div>

                <div class="sm:w-2/3">
                    <Calendar
                        visits={data.data.visits}
                        fullSlots={data.doctorAvailability}
                        {selectedDate}
                        onSelect={(date: Date) => (selectedDate = date)}
                    />
                </div>
            </div>
        </Card>
    {/if}
</div>
