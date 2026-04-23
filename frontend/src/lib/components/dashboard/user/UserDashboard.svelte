<script lang="ts">
    let { data, form } = $props();
    import Calendar from "$lib/components/dashboard/utils/Calendar.svelte";
    import AppointmentBooking from "$lib/components/dashboard/utils/AppointmentBooking.svelte";
</script>

<div class="flex flex-col gap-8">
    <AppointmentBooking
            doctorChoose
            doctorList={data.data.doctors}
            error={form?.message}
    />

    <Calendar calendarData={data.data.calendarData} />
</div>