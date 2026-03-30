<script lang="ts">
    import { enhance } from "$app/forms";
    import type { ActionData } from "./$types";
    const { form }: { form: ActionData } = $props();

    let step = $derived(form?.step === 2 ? 2 : 1);

    let email = $derived(form?.email ?? "");
    let password = $state("");
    let confirm = $state("");

    function nextStep(e: SubmitEvent) {
        e.preventDefault();
        step = 2;
    }
</script>

<main class="min-h-screen bg-secondary flex items-center justify-center px-4">
    <div
        class="bg-white border border-primary/30 rounded-2xl p-10 w-full max-w-sm shadow-sm"
    >
        <h1 class="text-primary text-2xl font-semibold text-center mb-1">
            Dentist+
        </h1>
        <hr class="border-primary/20 mb-6" />

        {#if form?.error}
            <p class="text-red-500 text-sm text-center mb-4">{form.error}</p>
        {/if}

        {#if step === 1}
            <form onsubmit={nextStep} class="flex flex-col gap-4">
                <label class="flex flex-col gap-1.5">
                    <span class="text-primary/60 text-sm">Email</span>
                    <input
                        type="email"
                        bind:value={email}
                        required
                        class="bg-secondary border border-transparent rounded-lg px-3 py-2.5 text-sm text-primary outline-none focus:border-primary/40 transition-colors"
                    />
                </label>
                <label class="flex flex-col gap-1.5">
                    <span class="text-primary/60 text-sm">Password</span>
                    <input
                        type="password"
                        bind:value={password}
                        required
                        minlength="8"
                        class="bg-secondary border border-transparent rounded-lg px-3 py-2.5 text-sm text-primary outline-none focus:border-primary/40 transition-colors"
                    />
                </label>
                <label class="flex flex-col gap-1.5">
                    <span class="text-primary/60 text-sm">Confirm Password</span
                    >
                    <input
                        type="password"
                        bind:value={confirm}
                        required
                        minlength="8"
                        class="bg-secondary border border-transparent rounded-lg px-3 py-2.5 text-sm text-primary outline-none focus:border-primary/40 transition-colors"
                    />
                </label>
                <button
                    type="submit"
                    class="bg-primary text-white font-semibold text-sm py-3 rounded-lg mt-2 hover:bg-primary/90 transition-colors"
                >
                    Sign up
                </button>
            </form>

            <div class="text-center mt-4">
                <a
                    href="/auth/login"
                    class="text-primary/60 text-sm underline underline-offset-2 hover:text-primary transition-colors"
                >
                    Login instead
                </a>
            </div>
        {:else}
            <form method="POST" use:enhance class="flex flex-col gap-4">
                <input type="hidden" name="email" value={email} />
                <input type="hidden" name="password" value={password} />
                <input type="hidden" name="confirm" value={confirm} />

                <label class="flex flex-col gap-1.5">
                    <span class="text-primary/60 text-sm">Full Name</span>
                    <input
                        type="text"
                        name="fullName"
                        required
                        class="bg-secondary border border-transparent rounded-lg px-3 py-2.5 text-sm text-primary outline-none focus:border-primary/40 transition-colors"
                    />
                </label>
                <label class="flex flex-col gap-1.5">
                    <span class="text-primary/60 text-sm">Full Address</span>
                    <input
                        type="text"
                        name="address"
                        required
                        class="bg-secondary border border-transparent rounded-lg px-3 py-2.5 text-sm text-primary outline-none focus:border-primary/40 transition-colors"
                    />
                </label>
                <label class="flex flex-col gap-1.5">
                    <span class="text-primary/60 text-sm">Phone Number</span>
                    <input
                        type="tel"
                        name="phoneNumber"
                        required
                        class="bg-secondary border border-transparent rounded-lg px-3 py-2.5 text-sm text-primary outline-none focus:border-primary/40 transition-colors"
                    />
                </label>
                <button
                    type="submit"
                    class="bg-primary text-white font-semibold text-sm py-3 rounded-lg mt-2 hover:bg-primary/90 transition-colors"
                >
                    Continue
                </button>
            </form>
        {/if}
    </div>
</main>
