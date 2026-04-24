<script lang="ts">
    import { page } from '$app/state';
    import { goto } from '$app/navigation';

    import Calendar from "$lib/components/dashboard/utils/Calendar.svelte";
    import AppointmentBooking from "$lib/components/dashboard/utils/AppointmentBooking.svelte";
    import CardTitle from "$lib/components/utils/CardTitle.svelte";
    import Card from "$lib/components/utils/Card.svelte";

    let {data, form} = $props();

    const currentView = $derived(page.url.searchParams.get('view') || 'main');

    const onBooking = (e) => {
        e.preventDefault();
        goto('?view=booking', { noScroll: true });
    }

    const goBack = (e) => {
        e.preventDefault();
        goto('?view=main', { noScroll: true });
    }
</script>

<div class="flex flex-col gap-5 mt-3">
    {#if currentView === 'main'}
        <div class="flex gap-5">
            <Card style={"w-2/3"}>
                <div class="flex justify-between items-start">
                    <CardTitle text="Calendar"/>
                    <button
                            on:click={onBooking}
                            class="bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors px-2 py-2">
                        Book appointment
                    </button>
                </div>

                <Calendar
                        visits={data.data.visits}
                        fullSlots={[]}
                        userId={data.user.userId}
                />

            </Card>

            <Card style={"w-1/3"}>
                <CardTitle text="Payments"/>
            </Card>
        </div>

        <Card style={"full"}>
            <CardTitle text="Tooth"/>
        </Card>
    {/if}

    {#if currentView === 'booking'}
        <Card style={"full"}>
            <CardTitle text="Book appointment" />
            <div class="flex justify-between">
                <div class="w-1/3">
                    <AppointmentBooking
                            doctorChoose
                            doctorList={data.data.doctors}
                            error={form?.message}
                    />
                </div>

                <div class="w-2/3">
                    <Calendar
                            visits={data.data.visits}
                            fullSlots={data.data.fullSlots}
                            userId={data.user.userId}
                    />
                </div>
            </div>
        </Card>
    {/if}
</div>