<script lang="ts">
    import { onMount } from "svelte";

    let { user } = $props();

    let visits = $state<any[]>([]);
    let procedures = $state<any[]>([]);
    let payments = $state<any[]>([]);
    let teeth = $state<any[]>([]);
    let images = $state<any[]>([]);

    const API = "/api";

    async function loadVisits() {
        const res = await fetch(`${API}/visits`);
        if (res.ok) visits = await res.json();
    }

    async function loadProcedures() {
        const res = await fetch(`${API}/procedures`);
        if (res.ok) procedures = await res.json();
    }

    async function loadPayments() {
        const res = await fetch(`${API}/payments`);
        if (res.ok) payments = await res.json();
    }

    async function loadTeeth() {
        const res = await fetch(`${API}/patients/${user.id}/teeth`);
        if (res.ok) teeth = await res.json();
    }

    async function loadImages() {
        const res = await fetch(`${API}/patients/${user.id}/images`);
        if (res.ok) images = await res.json();
    }

    async function loadAll() {
        await Promise.all([
            loadVisits(),
            loadProcedures(),
            loadPayments(),
            loadTeeth(),
            loadImages(),
        ]);
    }

    onMount(() => {
        loadAll();
    });
</script>

<div class="max-w-6xl mx-auto space-y-10">
    <h1 class="text-2xl font-bold">USER DASHBOARD</h1>

    <!-- PROFILE -->
    <section class="p-4 border rounded">
        <h2 class="text-xl font-semibold">Profil</h2>
        <p>{user.firstName} {user.lastName}</p>
        <p>{user.email}</p>
        <p>{user.address}</p>
        <p>{user.phoneNumber}</p>
    </section>

    <!-- VISITS -->
    <section>
        <h2 class="text-xl font-semibold mb-2">Wizyty</h2>

        <table class="w-full border">
            <tbody>
                {#each visits as v (v.id)}
                    <tr>
                        <td>{v.dateTime}</td>
                        <td>{v.status}</td>
                        <td>{v.description}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </section>

    <!-- PROCEDURES -->
    <section>
        <h2 class="text-xl font-semibold mb-2">Leczenie</h2>

        <table class="w-full border">
            <tbody>
                {#each procedures as p (p._id)}
                    <tr>
                        <td>{p.date}</td>
                        <td>{p.description}</td>
                        <td>{p.cost} PLN</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </section>

    <!-- PAYMENTS -->
    <section>
        <h2 class="text-xl font-semibold mb-2">Płatności</h2>

        <table class="w-full border">
            <tbody>
                {#each payments as p (p.id)}
                    <tr>
                        <td>{p.amount}</td>
                        <td>{p.status}</td>
                        <td>{p.createdAt}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </section>

    <!-- TEETH -->
    <section>
        <h2 class="text-xl font-semibold mb-2">Stan zębów</h2>

        <table class="w-full border">
            <tbody>
                {#each teeth as t}
                    <tr>
                        <td>{t.tooth}</td>
                        <td>{t.status}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </section>

    <!-- IMAGES -->
    <section>
        <h2 class="text-xl font-semibold mb-2">Zdjęcia</h2>

        <div class="grid grid-cols-3 gap-2">
            {#each images as img}
                <img src={img.url} alt={img.filename} class="w-full border" />
            {/each}
        </div>
    </section>
</div>
