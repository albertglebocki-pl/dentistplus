<script lang="ts">
    import { page } from "$app/state";
    import { goto } from "$app/navigation";

    import Calendar from "$lib/components/dashboard/utils/Calendar.svelte";
    import AppointmentBooking from "$lib/components/dashboard/utils/AppointmentBooking.svelte";
    import CardTitle from "$lib/components/utils/CardTitle.svelte";
    import Card from "$lib/components/utils/Card.svelte";
    import DentalChart from "../utils/DentalChart.svelte";
    import ProceduresHistory from "$lib/components/dashboard/utils/ProceduresHistory.svelte";

    let {
        data,
        form
    } = $props();

    const currentView = $derived(page.url.searchParams.get("view") || "main");
    const procedures = $derived(data.data.procedures);

    let selectedDate: Date | null = $state(null);

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
        <div class="flex gap-5">
            <Card style={"w-2/3"}>
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

            <Card style={"w-1/3"}>
                <CardTitle text="Payments" />
                <div class="max-h-[310px] overflow-y-auto min-h-0">
                    <ProceduresHistory procedures={procedures} folded/>
                </div>
            </Card>
        </div>

        <Card style={"full"}>
            <CardTitle text="Tooth" />

            <DentalChart />
        </Card>
    {/if}

    {#if currentView === "booking"}
        <Card style={"full"}>
            <CardTitle text="Book appointment" />
            <div class="flex justify-between">
                <div class="w-1/3">
                    <AppointmentBooking
                        doctorChoose
                        doctorList={data.data.doctors}
                        error={form?.message}
                        success={form?.success}
                        onDoctorChange={handleDoctorChange}
                        selectedDate={selectedDate}
                    />
                </div>

                <div class="w-2/3">
                    <Calendar
                        visits={data.data.visits}
                        fullSlots={data.doctorAvailability}
                        selectedDate={selectedDate}
                        onSelect={(date: Date) => selectedDate = date}
                    />
                </div>
            </div>
        </Card>
    {/if}
</div>
