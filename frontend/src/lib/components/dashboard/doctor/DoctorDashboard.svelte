<script lang="ts">
    import Calendar from "$lib/components/dashboard/utils/Calendar.svelte";
    import AppointmentBooking from "$lib/components/dashboard/utils/AppointmentBooking.svelte";
    import CardTitle from "$lib/components/utils/CardTitle.svelte";
    import Card from "$lib/components/utils/Card.svelte";
    import {page} from "$app/state";
    import {goto} from "$app/navigation";
    import UpcomingVisitCard from "$lib/components/dashboard/doctor/UpcomingVisitCard.svelte";

    let {data, form} = $props();
    const visits = $derived(data.data.visits);
    const treatments = $derived(data.treatments);
    const patientVisits = $derived(data.patientVisits);

    const currentView = $derived(page.url.searchParams.get('view') || 'main');

    const onBooking = (e) => {
        e.preventDefault();
        goto('?view=booking', {noScroll: true});
    }

    const goBack = (e) => {
        e.preventDefault();
        goto('?view=main', {noScroll: true});
    }

    const isSameDay = (date: string) => {
        const d1 = new Date(date);
        const d2 = new Date();
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }

    const todayVisits = $derived(visits.filter(visit => isSameDay(visit.dateTime)));

    const selectedVisitId = $derived(page.url.searchParams.get('id'));
    const selectedVisit = $derived(visits.find(v => v._id === selectedVisitId));
    const patient = $derived(selectedVisit?.patient || null);
</script>

<div class="flex flex-col gap-5 mt-3 h-full">
    {#if currentView === 'main'}
        <div class="flex gap-5 items-stretch h-91">

            <Card style={"w-2/3 h-full"}>
                <CardTitle text="Calendar"/>
                <Calendar
                        visits={visits}
                        fullSlots={[]}
                />
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
                <p>{patient.firstName} {patient.lastName}</p>
                <p>Email: {patient.email}</p>
                <p>Phone: {patient.phoneNumber}</p>
                <p>Address: {patient.address}</p>
            </Card>
            <Card style={"w-2/3"}>
                <CardTitle text="Treatment history"/>
                {#if treatments.length > 0}
                    <p>TODO</p>
                {:else}
                    <p>No treatment history</p>
                {/if}
            </Card>
        </div>

        <Card style={"w-full"}>
            <CardTitle text="Teeth status TODO"/>
        </Card>

        <Card style={"w-full"}>
            <CardTitle text="Current Visit"/>
        </Card>

        <Card style={"w-full"}>
            <CardTitle text="Book next appointment"/>

            <div class="flex justify-between">
                <div class="w-1/3">
                    <AppointmentBooking
                            doctorChoose={false}
                            error={form?.message}
                            success={form?.success}
                            patientId={patient.id}
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