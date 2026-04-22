<script lang="ts">
    import { enhance } from "$app/forms";

    let { data, form } = $props();

    const input =
        "bg-secondary border border-primary/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/50";

    const label = "flex flex-col gap-1.5 text-sm";

    function formatDate(d: string) {
        return new Date(d).toLocaleDateString("pl-PL");
    }
</script>

<main class="min-h-screen bg-secondary p-6">
    <div class="max-w-5xl mx-auto">
        <!-- HEADER -->
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-semibold text-primary">Płatności</h1>

            {#if data.user.role === "DOCTOR" || data.user.role === "ADMIN"}
                <a
                    href="#form"
                    class="bg-primary text-white px-4 py-2 rounded-lg text-sm"
                >
                    + Nowa płatność
                </a>
            {/if}
        </div>

        <!-- FORM -->
        {#if data.user.role === "DOCTOR" || data.user.role === "ADMIN"}
            <form
                id="form"
                method="POST"
                action="?/create"
                use:enhance
                class="bg-white border border-primary/20 rounded-xl p-6 mb-6 flex flex-col gap-4"
            >
                {#if form?.error}
                    <p class="text-red-500 text-sm">{form.error}</p>
                {/if}

                <div class="grid grid-cols-2 gap-4">
                    <label class={label}>
                        ID procedury
                        <input
                            name="medicalProcedureId"
                            class={input}
                            required
                        />
                    </label>

                    <label class={label}>
                        Kwota
                        <input
                            name="amount"
                            type="number"
                            step="0.01"
                            class={input}
                            required
                        />
                    </label>

                    <label class={label}>
                        Success URL
                        <input name="successUrl" class={input} />
                    </label>

                    <label class={label}>
                        Error URL
                        <input name="errorUrl" class={input} />
                    </label>
                </div>

                <button class="bg-primary text-white py-2 rounded-lg text-sm">
                    Utwórz płatność
                </button>
            </form>
        {/if}

        <!-- TABLE -->
        <div
            class="bg-white border border-primary/20 rounded-xl overflow-hidden"
        >
            {#if data.payments.length === 0}
                <div class="p-6 text-center text-primary/50">
                    Brak płatności
                </div>
            {:else}
                <table class="w-full text-sm">
                    <thead
                        class="bg-secondary text-primary/60 text-xs uppercase"
                    >
                        <tr>
                            <th class="p-3 text-left">Data</th>
                            <th class="p-3 text-left">Kwota</th>
                            <th class="p-3 text-left">Status</th>
                            {#if data.user.role !== "USER"}
                                <th class="p-3 text-left">Pacjent</th>
                            {/if}
                            <th class="p-3 text-left">Akcje</th>
                        </tr>
                    </thead>

                    <tbody>
                        {#each data.payments as p}
                            <tr class="border-t border-primary/10">
                                <td class="p-3">{formatDate(p.createdAt)}</td>

                                <td class="p-3 font-medium">
                                    {p.amount} PLN
                                </td>

                                <td class="p-3">
                                    <span
                                        class="px-2 py-1 rounded text-xs
                    {p.status === 'COMPLETED' && 'bg-green-100 text-green-700'}
                    {p.status === 'PENDING' && 'bg-yellow-100 text-yellow-700'}
                    {p.status === 'FAILED' && 'bg-red-100 text-red-700'}"
                                    >
                                        {p.status}
                                    </span>
                                </td>

                                {#if data.user.role !== "USER"}
                                    <td class="p-3 text-primary/60">
                                        #{p.patientId}
                                    </td>
                                {/if}

                                <td class="p-3">
                                    {#if p.status === "PENDING"}
                                        <a
                                            href={`/payments/pay/${p.token}`}
                                            class="text-primary underline text-sm"
                                        >
                                            {data.user.role === "USER"
                                                ? "Zapłać"
                                                : "Link"}
                                        </a>
                                    {/if}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            {/if}
        </div>
    </div>
</main>
