<script lang="ts">
    import { enhance } from "$app/forms";
    import type { ActionData } from "./$types";

    const { form }: { form: ActionData } = $props();

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

        <form method="POST" use:enhance class="flex flex-col gap-4">
            <label class={labelClass}>
                <span class={labelTextClass}>Email</span>
                <input
                    type="email"
                    name="email"
                    value={form?.email ?? ""}
                    required
                    class={inputClass}
                />
            </label>
            <label class={labelClass}>
                <span class={labelTextClass}>Password</span>
                <input
                    type="password"
                    name="password"
                    required
                    class={inputClass}
                />
            </label>

            <div class="flex items-center justify-between">
                <label class="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        name="remember"
                        class="w-3.5 h-3.5 rounded border border-primary/30 accent-primary"
                    />
                    <span class="text-primary/50 text-sm">Remember me</span>
                </label>
                <a
                    href="/auth/forgot-password"
                    class="text-primary/50 text-sm hover:text-primary transition-colors"
                >
                    Forgot password
                </a>
            </div>

            <button
                type="submit"
                class="bg-primary text-white font-semibold text-sm py-3 rounded-lg mt-2 hover:bg-primary/90 transition-colors"
            >
                Sign in
            </button>
        </form>

        <p class="text-center mt-4 text-primary/60 text-sm">
            No account?
            <a
                href="/auth/register"
                class="underline underline-offset-2 hover:text-primary transition-colors"
                >Create one</a
            >
        </p>
    </div>
</main>
