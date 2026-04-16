<script>
    let procedures = [
        { name: "Filling", price: 120 },
        { name: "Implant", price: 2500 },
    ];
</script>

<div class="bg-white border rounded-xl p-4">
    <h2 class="font-semibold mb-3 text-primary">Procedures</h2>

    {#each procedures as p}
        <div class="flex justify-between py-2 border-b">
            <span>{p.name}</span>
            <span class="font-semibold text-primary">{p.price} zł</span>
        </div>
    {/each}
</div>
