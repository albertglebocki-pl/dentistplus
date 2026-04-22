<script lang="ts">
    let {data, form} = $props();
    import Calendar from "$lib/components/dashboard/utils/Calendar.svelte";
    import AppointmentBooking from "$lib/components/dashboard/utils/AppointmentBooking.svelte";
</script>

<div class="max-w-5xl mx-auto">
    <h1>USER DASHBOARD</h1>
    <p>
        {data.user.id}
        {data.user.email}
        {data.user.role}
        {data.user.firstName}
        {data.user.lastName}
        {data.user.address}
        {data.user.phoneNumber}
    </p>

    <AppointmentBooking doctorChoose doctorList={data.data.doctors} error={form?.message}/>
</div>