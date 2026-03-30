<section class="bg-primary min-h-65 px-6 py-6 flex flex-col">
    <nav class="flex items-center justify-between mb-10">
        <span class="text-white text-xl font-bold tracking-tight">Dentist+</span
        >
        <a
            href="/auth/login"
            class="border border-white text-white text-sm font-medium px-4 py-1.5 rounded hover:bg-white hover:text-primary transition-colors duration-200"
        >
            Sign in
        </a>
    </nav>

    <div
        class="flex flex-col items-center text-center gap-6 flex-1 justify-center pb-8"
    >
        <h1 class="text-white text-[1.75rem] leading-snug font-bold max-w-xs">
            Better management<br />for dentistry and its customers.
        </h1>
        <a
            href="#about"
            class="border border-white/60 text-white text-sm font-medium px-6 py-2 rounded hover:bg-white hover:text-primary transition-colors duration-200"
        >
            Learn more
        </a>
    </div>
</section>

<section class="bg-secondary px-6 py-8">
    <p
        class="text-primary text-xs font-semibold uppercase tracking-wider mb-2"
        id="about"
    >
        Why Dentist+?
    </p>
    <p class="text-primary text-lg font-bold leading-snug max-w-sm">
        Dentist+ makes it easy to manage your dentist appointments and keep
        track of your payments.
    </p>

    <div class="mt-6 grid grid-cols-1 gap-4">
        <div class="bg-white rounded-xl p-5 shadow-sm border border-primary/10">
            <div
                class="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center mb-3"
            >
                <svg
                    class="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
            </div>
            <h3 class="text-primary font-bold text-sm mb-1">
                Appointment scheduling
            </h3>
            <p class="text-gray-500 text-sm leading-relaxed">
                Book, reschedule, and manage all your dental visits with
                real-time availability.
            </p>
        </div>

        <div class="bg-white rounded-xl p-5 shadow-sm border border-primary/10">
            <div
                class="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center mb-3"
            >
                <svg
                    class="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                </svg>
            </div>
            <h3 class="text-primary font-bold text-sm mb-1">
                Payment tracking
            </h3>
            <p class="text-gray-500 text-sm leading-relaxed">
                Monitor invoices, balances, and payment history with full
                clarity.
            </p>
        </div>
    </div>
</section>

<section class="bg-accent px-6 py-8">
    <p
        class="text-white/70 text-xs font-semibold uppercase tracking-wider mb-2"
    >
        Transparency
    </p>
    <p class="text-white text-lg font-bold leading-snug max-w-sm">
        We make sure to always be transparent about our pricing and services.
    </p>
    <div class="mt-6 space-y-3">
        {#each ["No hidden fees", "Clear treatment plans", "Itemised billing"] as item}
            <div class="flex items-center gap-3">
                <div
                    class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0"
                >
                    <svg
                        class="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="3"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
                <span class="text-white/90 text-sm">{item}</span>
            </div>
        {/each}
    </div>
</section>

<section class="bg-primary px-6 py-10 text-center">
    <h2 class="text-white text-xl font-bold mb-2">Ready to get started?</h2>
    <p class="text-white/70 text-sm mb-6">
        Join thousands of patients already using Dentist+.
    </p>
    <div class="flex justify-center">
        <a
            href="/auth/register"
            class="bg-white text-primary font-bold text-sm px-8 py-3 rounded-lg hover:bg-secondary transition-colors duration-200 w-full max-w-xs text-center"
        >
            Create free account
        </a>
    </div>
</section>

<footer class="bg-primary/90 px-6 py-5 text-center">
    <p class="text-white/40 text-xs">© 2026 Dentist+. All rights reserved.</p>
</footer>
