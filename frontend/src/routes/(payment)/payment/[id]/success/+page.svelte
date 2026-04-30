<script lang="ts">
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();
</script>

<div class="min-h-screen flex items-center justify-center bg-secondary/10 px-4">
    <div
        class="w-full max-w-md bg-white rounded-2xl shadow-xl border border-secondary/20 overflow-hidden"
    >
        <!-- Header -->
        <div class="px-6 py-5 bg-green-50 border-b border-green-100">
            <h1 class="text-lg font-semibold text-green-700">
                Payment Successful
            </h1>
            <p class="text-sm text-green-600">
                Your transaction has been completed
            </p>
        </div>

        <!-- Content -->
        <div class="px-6 py-8 text-center space-y-4">
            <!-- Icon -->
            <div
                class="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center"
            >
                <svg
                    class="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M5 13l4 4L19 7"
                    />
                </svg>
            </div>

            <div>
                <p class="text-sm text-gray-500">Amount paid</p>
                <p class="text-3xl font-bold text-primary mt-1">
                    {data.payment.amount ?? "—"}
                    <span class="text-base font-medium text-gray-500">PLN</span>
                </p>
            </div>

            {#if data.payment.medicalProcedureId.description}
                <div class="pt-2 border-t border-gray-100">
                    <p class="text-xs text-gray-400">Medical procedure</p>
                    <p class="text-sm text-gray-700 font-medium">
                        {data.payment.medicalProcedureId.description}
                    </p>
                </div>
            {/if}

            <p class="text-sm text-gray-500 pt-2">
                You will receive a confirmation email shortly.
            </p>
        </div>

        <!-- Footer -->
        <div class="px-6 pb-6">
            <a
                href="/"
                class="block text-center w-full py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition"
            >
                Back to dashboard
            </a>
        </div>
    </div>
</div>
