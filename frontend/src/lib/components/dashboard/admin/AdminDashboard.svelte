<script lang="ts">
    import { onMount } from "svelte";

    let { user, token } = $props();

    const api = (url: string, options: RequestInit = {}) =>
        fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                ...(options.headers || {}),
            },
        });

    let users = $state<any[]>([]);
    let payments = $state<any[]>([]);
    let catalog = $state<any[]>([]);

    let doctorForm = $state({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
    });

    let catalogForm = $state({
        name: "",
        description: "",
        defaultCost: 0,
    });

    async function loadUsers() {
        const res = await api(`/api/patients`);
        if (res.ok) users = await res.json();
    }

    async function loadPayments() {
        const res = await api(`/api/payments`);
        if (res.ok) payments = await res.json();
    }

    async function loadCatalog() {
        const res = await api(`/api/catalog`);
        if (res.ok) catalog = await res.json();
    }

    async function loadAll() {
        await Promise.all([loadUsers(), loadPayments(), loadCatalog()]);
    }

    async function blockUser(id: number) {
        await api(`/api/admin/users/${id}/block`, {
            method: "PATCH",
        });

        await loadUsers();
    }

    async function unblockUser(id: number) {
        await api(`/api/admin/users/${id}/unblock`, {
            method: "PATCH",
        });

        await loadUsers();
    }

    async function createDoctor() {
        await api(`/api/admin/doctors`, {
            method: "POST",
            body: JSON.stringify(doctorForm),
        });

        doctorForm = {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
        };

        await loadUsers();
    }

    async function createCatalogItem() {
        await api(`/api/catalog`, {
            method: "POST",
            body: JSON.stringify(catalogForm),
        });

        catalogForm = {
            name: "",
            description: "",
            defaultCost: 0,
        };

        await loadCatalog();
    }

    onMount(() => {
        loadAll();
    });
</script>

<div class="max-w-6xl mx-auto space-y-10">
    <h1 class="text-2xl font-bold">ADMIN DASHBOARD</h1>

    <!-- USERS -->
    <section>
        <h2 class="text-xl font-semibold mb-2">Użytkownicy</h2>

        <table class="w-full border">
            <tbody>
                {#each users as u (u.id)}
                    <tr>
                        <td>{u.id}</td>
                        <td>{u.email}</td>
                        <td>{u.role}</td>
                        <td>{u.active ? "TAK" : "NIE"}</td>
                        <td>
                            {#if u.active}
                                <button onclick={() => blockUser(u.id)}>
                                    Zablokuj
                                </button>
                            {:else}
                                <button onclick={() => unblockUser(u.id)}>
                                    Odblokuj
                                </button>
                            {/if}
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </section>

    <!-- CREATE DOCTOR -->
    <section>
        <h2>Dodaj lekarza</h2>

        <input placeholder="Email" bind:value={doctorForm.email} />
        <input
            type="password"
            placeholder="Hasło"
            bind:value={doctorForm.password}
        />
        <input placeholder="Imię" bind:value={doctorForm.firstName} />
        <input placeholder="Nazwisko" bind:value={doctorForm.lastName} />
        <input placeholder="Telefon" bind:value={doctorForm.phoneNumber} />

        <button onclick={createDoctor}>Utwórz lekarza</button>
    </section>

    <!-- CATALOG -->
    <section>
        <h2>Katalog procedur</h2>

        <input placeholder="Nazwa" bind:value={catalogForm.name} />
        <input placeholder="Opis" bind:value={catalogForm.description} />
        <input
            type="number"
            placeholder="Cena"
            bind:value={catalogForm.defaultCost}
        />

        <button onclick={createCatalogItem}>Dodaj procedurę</button>

        <ul>
            {#each catalog as c (c._id)}
                <li>{c.name} - {c.defaultCost} PLN</li>
            {/each}
        </ul>
    </section>

    <!-- PAYMENTS -->
    <section>
        <h2>Płatności</h2>

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
