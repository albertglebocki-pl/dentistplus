<script lang="ts">
    let { visits = [], fullSlots = [], userId } = $props();

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    function getMonday(date: Date) {
        const d = new Date(date);
        const day = (d.getDay() + 6) % 7; // Mon = 0
        d.setDate(d.getDate() - day);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    function getWeekDays(start: Date) {
        return Array.from({length: 5}, (_, i) => {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            return d;
        });
    }

    let currentDate = $state(new Date());

    const currentWeekStart = $derived(getMonday(currentDate));
    const weekDays = $derived(getWeekDays(currentWeekStart));
    const currentMonthLabel = $derived(months[weekDays[0].getMonth()]);

    const calendarData = $derived.by(() => {
        const grid = Array.from({length: 5}, () => ({taken: [], mine: []}));

        const start = currentWeekStart;
        const end = new Date(start);
        end.setDate(start.getDate() + 5);

        fullSlots.forEach((slot: any) => {
            const d = new Date(slot.dateTime);
            if (d >= start && d < end) {
                const day = (d.getDay() + 6) % 7;
                if (day < 5) grid[day].taken.push(d.getUTCHours());
            }
        });

        visits.forEach((v: any) => {
            const d = new Date(v.dateTime);
            if (d >= start && d < end) {
                const day = (d.getDay() + 6) % 7;
                if (day < 5) grid[day].mine.push(d.getUTCHours());
            }
        });

        return grid;
    });

    function changeWeek(offset: number) {
        const nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + offset);
        currentDate = nextDate;
    }
</script>

<div class="flex gap-2">
    <div class="week-switch flex flex-col items-center justify-between p-2 font-bold">
        <button on:click={() => changeWeek(-7)}>↑</button>

        <div class="[writing-mode:vertical-rl] rotate-180">
            {weekDays[0].getDate()} - {weekDays[4].getDate()} {currentMonthLabel}
        </div>

        <button on:click={() => changeWeek(7)}>↓</button>
    </div>

    <div class="current-week grid grid-rows-5 gap-2 w-18 shrink-0 bg-primary text-secondary rounded p-2">
        {#each weekDays as dayDate, i}
            <div class="flex flex-col justify-center items-center">
                <p class="font-bold">{days[i]}</p>
                <p>
                    {String(dayDate.getDate()).padStart(2, '0')}.
                    {String(dayDate.getMonth() + 1).padStart(2, '0')}
                </p>
            </div>
        {/each}
    </div>

    <div class="calendar flex-1 grid grid-cols-11 grid-rows-5 gap-2">
        {#each weekDays as dayDate, dayIndex}
            {#each Array.from({length: 11}, (_, h) => 8 + h) as hour}
                {@const taken = (calendarData[dayIndex]?.taken ?? []).includes(hour)}
                {@const mine = (calendarData[dayIndex]?.mine ?? []).includes(hour)}

                <div class={`rounded text-center flex flex-col justify-between border p-0.5 ${mine ? 'bg-yellow-200' : ''}`}>
                    <div class={`h-2 w-full rounded ${taken || mine ? 'bg-red-500' : 'bg-green-400'}`}></div>
                    <p>{hour}</p>
                    <div class="h-2 w-full"></div>
                </div>
            {/each}
        {/each}
    </div>
</div>