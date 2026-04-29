<script lang="ts">
    let {
        visits = [],
        fullSlots = [],
        selectedDate = null as Date | null,
        onSelect = (date: Date | null) => {
        }
    } = $props();

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];


    const getMonday = (date: Date) => {
        const d = new Date(date);
        const day = (d.getDay() + 6) % 7; // Mon = 0
        d.setDate(d.getDate() - day);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    const getWeekDays = (start: Date) => {
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
        const grid = Array.from({length: 5}, () => ({
            taken: [] as number[],
            mine: [] as number [],
        }));

        const start = new Date(currentWeekStart);
        const end = new Date(start);
        end.setDate(start.getDate() + 5);

        fullSlots.forEach((slot: any) => {
            const d = new Date(slot.dateTime);
            if (d >= start && d < end) {
                const day = (d.getDay() + 6) % 7; // Mon=0
                if (day < 5) {
                    grid[day].taken.push(d.getUTCHours());
                }
            }
        });

        visits.forEach((v: any) => {
            const d = new Date(v.dateTime);
            if (d >= start && d < end) {
                const day = (d.getDay() + 6) % 7;
                if (day < 5) {
                    grid[day].mine.push(d.getUTCHours());
                }
            }
        });

        return grid;
    });

    const changeWeek = (offset: number) => {
        const nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + offset);
        currentDate = nextDate;

        onSelect(null);
    }

    const handleSelect = (datetime: Date) => {
        if (
            selectedDate &&
            selectedDate.getTime() === datetime.getTime()
        ) {
            onSelect(null);
            return;
        }

        onSelect(datetime);
    }
</script>

<div class="flex gap-2">
    <div
        class="week-switch flex flex-col items-center justify-between p-2 font-bold"
    >
        <button onclick={() => changeWeek(-7)}>↑</button>

        <div class="[writing-mode:vertical-rl] rotate-180">
            {weekDays[0].getDate()} - {weekDays[4].getDate()}
            {currentMonthLabel}
        </div>

        <button onclick={() => changeWeek(7)}>↓</button>
    </div>

    <div
        class="current-week grid grid-rows-5 gap-2 w-18 shrink-0 bg-primary text-secondary rounded p-2"
    >
        {#each weekDays as dayDate, i}
            <div class="flex flex-col justify-center items-center">
                <p class="font-bold">{days[i]}</p>
                <p>
                    {String(dayDate.getDate()).padStart(2, "0")}.
                    {String(dayDate.getMonth() + 1).padStart(2, "0")}
                </p>
            </div>
        {/each}
    </div>

    <div class="calendar flex-1 grid grid-cols-11 grid-rows-5 gap-2">
        {#each weekDays as dayDate, dayIndex}
            {#each Array.from({length: 11}, (_, h) => {
                const hour = 8 + h;

                const dateTime = new Date(dayDate);
                dateTime.setHours(hour, 0, 0, 0);

                return {
                    hour,
                    dateTime
                };
            }) as slot}
                {@const isMine = (calendarData[dayIndex]?.mine ?? []).includes(slot.hour)}
                {@const isTaken = (calendarData[dayIndex]?.taken ?? []).includes(slot.hour)}

                <button
                    type="button"
                    class="rounded text-center flex flex-col justify-between border p-0.5 hover:bg-gray-200
                        {isMine
                            ? 'bg-yellow-100 border-yellow-400'
                            : isTaken
                                ? 'bg-red-50 border-red-200 opacity-80'
                                : 'bg-white border-gray-300'}
                        {selectedDate?.getTime() === slot.dateTime.getTime()
                            ? 'border-primary border-2'
                            : ''}"
                    onclick={() => handleSelect(slot.dateTime)}
                >
                    <div
                        class="h-1.5 w-full rounded-full
                        {isMine
                            ? 'bg-yellow-500'
                            : isTaken
                              ? 'bg-red-500'
                              : 'bg-green-400'}"
                    ></div>

                    <p>{slot.hour}</p>
                    <div class="h-2 w-full"></div>
                </button>
            {/each}
        {/each}
    </div>
</div>
