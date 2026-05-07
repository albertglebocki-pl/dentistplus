<script lang="ts">
    let { visit } = $props();

    const formatDate = (datetime: any) => {
        const date = new Date(datetime);

        const day = String(date.getUTCDate()).padStart(2, "0");
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const year = date.getUTCFullYear();

        return `${day}-${month}-${year}`;
    };

    const formatTime = (datetime: any) => {
        const date = new Date(datetime);

        const hours = String(date.getUTCHours()).padStart(2, "0");
        return `${hours}:00`;
    };
</script>

<a
    href="?view=visit&id={visit._id}"
    class="p-1.5 rounded-lg border bg-secondary"
>
    <div class="flex justify-between pb-1">
        <p class="text-sm">
            {formatDate(visit.dateTime)}
            {formatTime(visit.dateTime)}
        </p>
        <p class="text-sm">
            {visit.patient.firstName || "Name"}
            {visit.patient.lastName || "Lastname"}
        </p>
    </div>
    <div class="">{visit.description || "Appointment description"}</div>
</a>
