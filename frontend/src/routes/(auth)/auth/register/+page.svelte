<script lang="ts">
    import { enhance } from "$app/forms";
    import type { ActionData } from "./$types";

    const { form }: { form: ActionData } = $props();

    let step = $derived(form?.step === 2 ? 2 : 1);
    let email = $derived(form?.email ?? "");
    let password = $state("");
    let confirm = $state("");

    const inputClass =
        "bg-secondary border border-transparent rounded-lg px-3 py-2.5 text-sm text-primary outline-none focus:border-primary/40 transition-colors";
    const labelClass = "flex flex-col gap-1.5";
    const labelTextClass = "text-primary/60 text-sm";
</script>

<main class="min-h-screen bg-secondary flex items-center justify-center px-4">
    <div
        class="bg-white border border-primary/20 rounded-2xl p-10 w-full max-w-sm shadow-sm"
    >
        <h1 class="text-primary text-2xl font-semibold text-center mb-1">
            Dentist+
        </h1>
        <hr class="border-primary/20 mb-6" />

        {#if form?.error}
            <p class="text-red-500 text-sm text-center mb-4">{form.error}</p>
        {/if}

        {#if step === 1}
            <form
                onsubmit={(e) => {
                    e.preventDefault();
                    step = 2;
                }}
                class="flex flex-col gap-4"
            >
                <label class={labelClass}>
                    <span class={labelTextClass}>Email</span>
                    <input
                        type="email"
                        bind:value={email}
                        required
                        class={inputClass}
                    />
                </label>
                <label class={labelClass}>
                    <span class={labelTextClass}>Password</span>
                    <input
                        type="password"
                        bind:value={password}
                        required
                        minlength="8"
                        class={inputClass}
                    />
                </label>
                <label class={labelClass}>
                    <span class={labelTextClass}>Confirm Password</span>
                    <input
                        type="password"
                        bind:value={confirm}
                        required
                        minlength="8"
                        class={inputClass}
                    />
                </label>
                <button
                    type="submit"
                    class="bg-primary text-white font-semibold text-sm py-3 rounded-lg mt-2 hover:bg-primary/90 transition-colors"
                >
                    Continue
                </button>
            </form>
            <p class="text-center mt-4 text-primary/60 text-sm">
                Already have an account?
                <a
                    href="/auth/login"
                    class="underline underline-offset-2 hover:text-primary transition-colors"
                    >Log in</a
                >
            </p>
        {:else}
            <form method="POST" use:enhance class="flex flex-col gap-4">
                <input type="hidden" name="email" value={email} />
                <input type="hidden" name="password" value={password} />
                <input type="hidden" name="confirm" value={confirm} />

                {#each [{ label: "Full Name", name: "fullName", type: "text" }, { label: "Address", name: "address", type: "text" }, { label: "Phone Number", name: "phoneNumber", type: "tel" }] as field}
                    <label class={labelClass}>
                        <span class={labelTextClass}>{field.label}</span>
                        <input
                            type={field.type}
                            name={field.name}
                            required
                            class={inputClass}
                        />
                    </label>
                {/each}

                <button
                    type="submit"
                    class="bg-primary text-white font-semibold text-sm py-3 rounded-lg mt-2 hover:bg-primary/90 transition-colors"
                >
                    Create Account
                </button>
                <button
                    type="button"
                    onclick={() => (step = 1)}
                    class="text-primary/50 text-sm hover:text-primary transition-colors text-center"
                >
                    ← Back
                </button>
            </form>
        {/if}
    </div>
</main>
