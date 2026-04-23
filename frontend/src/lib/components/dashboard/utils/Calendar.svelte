<script lang="ts">
    let {calendarData = [], weekStart = new Date()} = $props();

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

    const weekDays = $derived(
        getWeekDays(getMonday(new Date()))
    );

    const currentMonthLabel = $derived(
        `${months[weekDays[0].getMonth()]}`
    );
</script>

<div class="flex gap-2">
    <div class="week-switch flex flex-col items-center justify-between p-2 font-bold">
        <button>↑</button>

        <div class="[writing-mode:vertical-rl] rotate-180">
            {weekDays[0].getDate()} - {weekDays[4].getDate()} {currentMonthLabel}
        </div>

        <button>↓</button>
    </div>

    <div class="current-week flex flex-col justify-around bg-primary text-secondary rounded p-2 gap-2">
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
        {#each weekDays as dayDate, day}
            {#each Array.from({length: 11}, (_, i) => 8 + i) as hour}
                {@const dayIndex = dayDate.getDay() - 1}
                {@const taken = (calendarData?.[dayIndex].taken ?? []).includes(hour)}
                {@const mine = (calendarData?.[dayIndex].mine ?? []).includes(hour)}

                <div class={`rounded text-center flex flex-col justify-between border p-0.5 ${mine ? 'bg-yellow-200' : ''}`}>
                    <div class={`h-2 w-full rounded ${taken || mine ? 'bg-red-500' : 'bg-green-400'}`}></div>

                    <p>{hour}</p>

                    <div class="h-2 w-full"></div>
                </div>
            {/each}
        {/each}
    </div>
</div>