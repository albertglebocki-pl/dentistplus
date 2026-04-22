<script lang="ts">
    import { enhance } from "$app/forms";
    let { form } = $props();

    const input =
        "bg-secondary border border-primary/20 rounded-lg px-3 py-2 text-sm";
</script>

<main class="min-h-screen flex items-center justify-center bg-secondary">
    <form
        method="POST"
        action="?/pay"
        use:enhance
        class="bg-white p-8 rounded-xl border border-primary/20 flex flex-col gap-4 w-full max-w-sm"
    >
        <h1 class="text-xl font-semibold text-primary text-center">Płatność</h1>

        <input name="cardNumber" placeholder="4111..." class={input} />
        <input name="name" placeholder="Jan Kowalski" class={input} />
        <input name="expiry" placeholder="MM/RR" class={input} />
        <input name="cvv" placeholder="CVV" class={input} />

        <button class="bg-primary text-white py-2 rounded-lg"> Zapłać </button>

        {#if form?.success}
            <p class="text-green-600 text-center">Sukces</p>
        {/if}

        {#if form && !form.success}
            <p class="text-red-500 text-center">
                {form.message ?? "Błąd płatności"}
            </p>
        {/if}
    </form>
</main>
