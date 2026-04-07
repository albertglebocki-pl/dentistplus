<script>
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
</script>

<div class="flex gap-2">
    <div class="week-switch flex flex-col items-center justify-between p-2 font-bold">
        <div>↑</div>
        <div class="[writing-mode:vertical-rl] rotate-180">
            1-5 March
        </div>
        <div>↓</div>
    </div>

    <div class="current-week flex flex-col justify-around bg-primary text-secondary rounded p-2 gap-2">
        {#each days as day, i}
            <div class="flex flex-col justify-center items-center">
                <p class="font-bold">{day}</p>
                <p>{String(i + 1).padStart(2, '0')}.03</p>
            </div>
        {/each}
    </div>

    <div class="calendar flex-1 grid grid-cols-11 grid-rows-5 gap-2">
        {#each Array(5 * 11) as _, i}
            <div class="rounded text-center flex flex-col justify-between border bg-transparent p-0.5">
                <div class="bg-green-400 h-2 w-full rounded"></div>
                <p>{8 + (i % 11)}</p>
                <div class="dummy | h-2 w-full"></div>
            </div>
        {/each}
    </div>

</div>