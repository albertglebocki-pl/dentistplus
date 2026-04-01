<script lang="ts">
    import { enhance } from "$app/forms";
    import type { ActionData } from "./$types";
    const { form }: { form: ActionData } = $props();
</script>

<main class="min-h-screen bg-secondary flex items-center justify-center px-4">
    <div
        class="bg-white border border-primary/30 rounded-2xl p-10 w-full max-w-sm shadow-sm"
    >
        <h1 class="text-primary text-2xl font-semibold text-center mb-7">
            Dentist+
        </h1>

        {#if form?.error}
            <p class="text-red-500 text-sm text-center mb-4">{form.error}</p>
        {/if}

        <form method="POST" use:enhance class="flex flex-col gap-4">
            <label class="flex flex-col gap-1.5">
                <span class="text-primary/60 text-sm">Email</span>
                <input
                    type="email"
                    name="email"
                    value={form?.email ?? ""}
                    required
                    class="bg-secondary border border-transparent rounded-lg px-3 py-2.5 text-sm text-primary outline-none focus:border-primary/40 transition-colors"
                />
            </label>

            <label class="flex flex-col gap-1.5">
                <span class="text-primary/60 text-sm">Password</span>
                <input
                    type="password"
                    name="password"
                    required
                    class="bg-secondary border border-transparent rounded-lg px-3 py-2.5 text-sm text-primary outline-none focus:border-primary/40 transition-colors"
                />
            </label>

            <div class="flex items-center justify-between mt-1">
                <label class="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
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

        <div class="text-center mt-4">
            <a
                href="/auth/register"
                class="text-primary/60 text-sm underline underline-offset-2 hover:text-primary transition-colors"
            >
                Create account instead
            </a>
        </div>
    </div>
</main>
