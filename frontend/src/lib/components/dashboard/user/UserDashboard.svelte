<script lang="ts">
    let {data, form} = $props();
    import Calendar from "$lib/components/dashboard/utils/Calendar.svelte";
    import AppointmentBooking from "$lib/components/dashboard/utils/AppointmentBooking.svelte";
</script>

<div class="flex flex-col gap-8">
    <AppointmentBooking
            doctorChoose
            doctorList={data.data.doctors}
            error={form?.message}
    />

    <Calendar
            visits={data.data.visits}
            fullSlots={data.data.fullSlots}
            userId={data.user.userId}
    />
</div>