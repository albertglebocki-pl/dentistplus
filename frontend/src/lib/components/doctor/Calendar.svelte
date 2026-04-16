<script>
    let {
        calendarData = {},
        weekStart = new Date(),
        onPreviousWeek,
        onNextWeek,
    } = $props();

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

    const weekDays = $derived(
        Array.from({ length: 5 }, (_, i) => {
            const d = new Date(weekStart);
            d.setDate(weekStart.getDate() + i);
            return d;
        }),
    );
</script>

<div class="grid grid-cols-5 gap-2">
    {#each weekDays as day, i}
        <div class="bg-secondary p-2 rounded text-xs">
            <div class="font-bold">{days[i]}</div>
            <div>{day.getDate()}</div>
        </div>
    {/each}
</div>
