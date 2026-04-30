<script lang="ts">
    const { data } = $props();
</script>

<div class="min-h-screen flex items-center justify-center bg-secondary/10 px-4">
    <div
        class="w-full max-w-md bg-white rounded-2xl shadow-xl border border-secondary/20 overflow-hidden"
    >
        <!-- Header -->
        <div class="px-6 py-5 bg-red-50 border-b border-red-100">
            <h1 class="text-lg font-semibold text-red-700">Payment Failed</h1>
            <p class="text-sm text-red-600">
                We couldn't process your transaction
            </p>
        </div>

        <!-- Content -->
        <div class="px-6 py-8 text-center space-y-4">
            <!-- Icon -->
            <div
                class="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center"
            >
                <svg
                    class="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </div>

            <div>
                <p class="text-sm text-gray-500">Attempted payment</p>
                <p class="text-3xl font-bold text-primary mt-1">
                    {data.payment.amount ?? "—"}
                    <span class="text-base font-medium text-gray-500">PLN</span>
                </p>
            </div>

            <div class="pt-2 border-t border-gray-100 space-y-2">
                <p class="text-xs text-gray-400">Reason</p>
                <p class="text-sm text-gray-700">
                    Payment was declined by the bank.
                </p>
            </div>

            <p class="text-sm text-gray-500 pt-2">
                Please check your card details or try another payment method.
            </p>
        </div>

        <!-- Footer -->
        <div class="px-6 pb-6 space-y-3">
            <button
                onclick={() => window.history.back()}
                class="w-full py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition"
            >
                Try again
            </button>

            <a
                href="/"
                class="block text-center text-sm text-gray-500 hover:text-gray-700"
            >
                Return to dashboard
            </a>
        </div>
    </div>
</div>
