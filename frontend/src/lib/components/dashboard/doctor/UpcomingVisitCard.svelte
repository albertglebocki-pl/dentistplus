<script lang="ts">
    let {visit} = $props();

    const formatDate = (datetime) => {
        const date = new Date(datetime);

        return date.toLocaleDateString('pl-PL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\./g, '-');
    }
</script>

<a
        href="?view=visit&id={visit._id}"
        class="p-1.5 rounded-lg border bg-secondary"
>
    <div class="flex justify-between pb-1">
        <p class="text-sm">{formatDate(visit.dateTime)}</p>
        <p class="text-sm">{visit.patient.firstName || "Name"} {visit.patient.lastName || "Lastname"}</p>
    </div>
    <div class="">{visit.description || "Appointment description"}</div>
</a>