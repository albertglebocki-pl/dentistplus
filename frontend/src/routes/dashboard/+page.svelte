<script lang="ts">
    import type { PageData } from "./$types";

    const { data }: { data: PageData } = $props();
</script>

<main class="min-h-screen bg-secondary p-6">
    <div class="max-w-5xl mx-auto mb-6">
        <div
            class="flex items-center justify-between border-2 border-primary rounded-xl px-6 py-4 bg-secondary"
        >
            <h1 class="text-xl font-semibold text-primary">Dentist+</h1>

            <div class="flex items-center gap-4">
                <span class="text-primary font-medium uppercase text-sm">
                    {data.user.email}
                </span>

                <div
                    class="w-10 h-10 border-2 border-primary rounded-lg flex items-center justify-center"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-6 h-6 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5.121 17.804A9 9 0 1118.879 17.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                </div>
            </div>
        </div>
    </div>

    <div class="max-w-5xl mx-auto">
        <div
            class="border-2 border-primary rounded-2xl min-h-125 bg-white/40 p-6"
        >
            <h2 class="text-lg font-semibold text-primary mb-4">Dashboard</h2>

            <p class="mb-2">
                Welcome, <strong>{data.user.email}</strong>
            </p>

            <p class="mb-6">
                Role: <code class="bg-secondary px-2 py-1 rounded text-sm"
                    >{data.user.role}</code
                >
            </p>

            <form action="/auth/logout" method="POST">
                <button
                    type="submit"
                    class="px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90 transition"
                >
                    Sign out
                </button>
            </form>
        </div>
    </div>
</main>
