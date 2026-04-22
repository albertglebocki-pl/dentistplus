<script lang="ts">
    import { onMount } from "svelte";

    let { user } = $props();

    let patients = $state<any[]>([]);
    let visits = $state<any[]>([]);
    let procedures = $state<any[]>([]);
    let payments = $state<any[]>([]);

    let procedureForm = $state({
        patientId: "",
        visitId: "",
        date: "",
        description: "",
    });

    let treatmentForm = $state([
        {
            tooth: "",
            catalogItemId: "",
            description: "",
            cost: 0,
        },
    ]);

    const API = "/api";

    async function loadPatients() {
        const res = await fetch(`${API}/patients`);
        if (res.ok) patients = await res.json();
    }

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

    async function loadAll() {
        await Promise.all([
            loadPatients(),
            loadVisits(),
            loadProcedures(),
            loadPayments(),
        ]);
    }

    function addTreatment() {
        treatmentForm = [
            ...treatmentForm,
            {
                tooth: "",
                catalogItemId: "",
                description: "",
                cost: 0,
            },
        ];
    }

    async function createProcedure() {
        const payload = {
            patientId: Number(procedureForm.patientId),
            visitId: procedureForm.visitId || undefined,
            date: procedureForm.date,
            description: procedureForm.description,
            treatments: treatmentForm.map((t) => ({
                tooth: t.tooth,
                catalogItemId: t.catalogItemId,
                description: t.description,
                cost: Number(t.cost),
            })),
        };

        await fetch(`${API}/procedures`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        procedureForm = {
            patientId: "",
            visitId: "",
            date: "",
            description: "",
        };

        treatmentForm = [
            {
                tooth: "",
                catalogItemId: "",
                description: "",
                cost: 0,
            },
        ];

        await loadProcedures();
    }

    onMount(() => {
        loadAll();
    });
</script>

<div class="max-w-6xl mx-auto space-y-10">
    <h1 class="text-2xl font-bold">DOCTOR DASHBOARD</h1>

    <!-- USER INFO -->
    <section class="p-4 border rounded">
        <h2 class="text-xl font-semibold">Profil</h2>
        <p>{user.id} {user.email} {user.role}</p>
        <p>{user.firstName} {user.lastName}</p>
        <p>{user.address} {user.phoneNumber}</p>
    </section>

    <!-- PATIENTS -->
    <section>
        <h2 class="text-xl font-semibold mb-2">Pacjenci</h2>

        <table class="w-full border">
            <tbody>
                {#each patients as p (p.id)}
                    <tr>
                        <td>{p.id}</td>
                        <td>{p.email}</td>
                        <td>{p.firstName}</td>
                        <td>{p.lastName}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </section>

    <!-- VISITS -->
    <section>
        <h2 class="text-xl font-semibold mb-2">Wizyty</h2>

        <table class="w-full border">
            <tbody>
                {#each visits as v (v.id)}
                    <tr>
                        <td>{v.id}</td>
                        <td>{v.patientId}</td>
                        <td>{v.dateTime}</td>
                        <td>{v.status}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </section>

    <!-- CREATE PROCEDURE -->
    <section class="p-4 border rounded space-y-2">
        <h2 class="text-xl font-semibold">Nowa procedura</h2>

        <input placeholder="Patient ID" bind:value={procedureForm.patientId} />
        <input
            placeholder="Visit ID (opcjonalnie)"
            bind:value={procedureForm.visitId}
        />
        <input type="datetime-local" bind:value={procedureForm.date} />
        <input placeholder="Opis" bind:value={procedureForm.description} />

        <h3 class="font-semibold">Zabiegi</h3>

        {#each treatmentForm as t, i}
            <div class="flex gap-2">
                <input placeholder="Ząb" bind:value={t.tooth} />
                <input placeholder="Catalog ID" bind:value={t.catalogItemId} />
                <input placeholder="Opis" bind:value={t.description} />
                <input type="number" placeholder="Cena" bind:value={t.cost} />
            </div>
        {/each}

        <button onclick={addTreatment}>+ Dodaj zabieg</button>

        <button onclick={createProcedure}> Utwórz procedurę </button>
    </section>

    <!-- PROCEDURES -->
    <section>
        <h2 class="text-xl font-semibold mb-2">Procedury</h2>

        <table class="w-full border">
            <tbody>
                {#each procedures as pr (pr._id)}
                    <tr>
                        <td>{pr.patientId}</td>
                        <td>{pr.date}</td>
                        <td>{pr.description}</td>
                        <td>{pr.cost}</td>
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
                        <td>{p.id}</td>
                        <td>{p.patientId}</td>
                        <td>{p.amount}</td>
                        <td>{p.status}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </section>
</div>
