<script lang="ts">
    import { page } from '$app/state';
    import { goto } from '$app/navigation';
    import Calendar from "$lib/components/dashboard/utils/Calendar.svelte";
    import AppointmentBooking from "$lib/components/dashboard/utils/AppointmentBooking.svelte";
    import CardTitle from "$lib/components/utils/CardTitle.svelte";

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
            <div class="calendar | bg-white p-3 w-2/3 rounded-lg">
                <div class="flex justify-between pb-5">
                    <CardTitle text="Calendar"/>
                    <button
                            on:click={onBooking}
                            class="bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors px-2">
                        Book appointment
                    </button>
                </div>

                <Calendar
                        visits={data.data.visits}
                        fullSlots={[]}
                        userId={data.user.userId}
                />
            </div>

            <div class="payments | bg-white p-3 w-1/3 rounded-lg">
                <CardTitle text="Payments"/>
            </div>
        </div>

        <div class="bg-white p-3 w-full rounded-lg">
            <CardTitle text="Tooth"/>
        </div>
    {/if}

    {#if currentView === 'booking'}
        <div class="booking | bg-white p-3 w-full rounded-lg">
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
        </div>
    {/if}
</div>