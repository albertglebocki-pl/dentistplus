<script lang="ts">
    const { data } = $props();

    function getCardBrand(number: string) {
        const n = number.replace(/\s/g, "");

        if (n.startsWith("4")) return "visa";
        if (n.startsWith("5")) return "mastercard";
        return null;
    }

    let cardNumber = $state("");
    let expiry = $state("");
    let cvc = $state("");

    const brand = $derived(getCardBrand(cardNumber));

    const procedureDescription = $derived(() => {
        const p = data.payment.medicalProcedureId;
        if (!p) return null;
        return typeof p === "object" ? p.description : null;
    });

    function formatCardNumber(value: string) {
        return value
            .replace(/\D/g, "")
            .slice(0, 16)
            .replace(/(.{4})/g, "$1 ")
            .trim();
    }

    function onCardInput(e: Event) {
        const input = e.target as HTMLInputElement;
        cardNumber = formatCardNumber(input.value);
        input.value = cardNumber;
    }

    function formatExpiry(value: string) {
        const cleaned = value.replace(/\D/g, "").slice(0, 4);

        if (cleaned.length < 3) return cleaned;
        return cleaned.slice(0, 2) + "/" + cleaned.slice(2);
    }

    function onExpiryInput(e: Event) {
        const input = e.target as HTMLInputElement;
        expiry = formatExpiry(input.value);
        input.value = expiry;
    }

    function onCvcInput(e: Event) {
        const input = e.target as HTMLInputElement;
        cvc = input.value.replace(/\D/g, "").slice(0, 3);
        input.value = cvc;
    }
</script>

<div class="min-h-screen flex items-center justify-center bg-secondary/10 px-4">
    <div
        class="w-full max-w-md bg-white rounded-2xl shadow-xl border border-secondary/20 overflow-hidden"
    >
        <!-- Header -->
        <div class="px-6 py-5 bg-secondary/20 border-b border-secondary/30">
            <h1 class="text-lg font-semibold text-primary">Secure Payment</h1>
            <p class="text-sm text-gray-600">Powered by internal gateway</p>
        </div>

        <!-- Amount + procedure -->
        <div class="px-6 py-5 space-y-2">
            <div>
                <p class="text-sm text-gray-500">Amount due</p>
                <p class="text-3xl font-bold text-primary mt-1">
                    {data.payment.amount}
                    <span class="text-base font-medium text-gray-500">PLN</span>
                </p>
            </div>

            {#if data.payment.medicalProcedureId}
                <div class="pt-2 border-t border-gray-100">
                    <p class="text-xs text-gray-400">Medical procedure</p>
                    <p class="text-sm text-gray-700 font-medium">
                        {data.payment.medicalProcedureId.description}
                    </p>
                </div>
            {/if}
        </div>

        <!-- Form -->
        <form method="POST" class="px-6 pb-6 space-y-4">
            <!-- Card number -->
            <div>
                <label class="text-xs text-gray-500" for="cardNumber"
                    >Card number</label
                >

                <div class="relative mt-1">
                    <input
                        name="cardNumber"
                        placeholder="1234 1234 1234 1234"
                        oninput={onCardInput}
                        class="w-full px-3 py-3 pr-16 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
                    />

                    <div
                        class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center transition-all duration-200"
                    >
                        {#if brand === "visa"}
                            <svg
                                class="h-6 w-auto"
                                viewBox="0 0 48 32"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect
                                    x="0"
                                    y="0"
                                    width="48"
                                    height="32"
                                    rx="4"
                                    fill="#0E4595"
                                />
                                <g transform="translate(8,6) scale(0.06)">
                                    <polygon
                                        fill="#FFFFFF"
                                        points="278.1975 334.2275 311.5585 138.4655 364.9175 138.4655 331.5335 334.2275"
                                    />
                                    <path
                                        fill="#FFFFFF"
                                        d="M524.3075,142.6875 C513.7355,138.7215 497.1715,134.4655 476.4845,134.4655 C423.7605,134.4655 386.6205,161.0165 386.3045,199.0695 C386.0075,227.1985 412.8185,242.8905 433.0585,252.2545 C453.8275,261.8495 460.8105,267.9695 460.7115,276.5375 C460.5795,289.6595 444.1255,295.6545 428.7885,295.6545 C407.4315,295.6545 396.0855,292.6875 378.5625,285.3785 L371.6865,282.2665 L364.1975,326.0905 C376.6605,331.5545 399.7065,336.2895 423.6355,336.5345 C479.7245,336.5345 516.1365,310.2875 516.5505,269.6525 C516.7515,247.3835 502.5355,230.4355 471.7515,216.4645 C453.1005,207.4085 441.6785,201.3655 441.7995,192.1955 C441.7995,184.0585 451.4675,175.3575 472.3565,175.3575 C489.8055,175.0865 502.4445,178.8915 512.2925,182.8575 L517.0745,185.1165 L524.3075,142.6875"
                                    />
                                    <path
                                        fill="#FFFFFF"
                                        d="M661.6145,138.4655 L620.3835,138.4655 C607.6105,138.4655 598.0525,141.9515 592.4425,154.6995 L513.1975,334.1025 L569.2285,334.1025 C569.2285,334.1025 578.3905,309.9805 580.4625,304.6845 C586.5855,304.6845 641.0165,304.7685 648.7985,304.7685 C650.3945,311.6215 655.2905,334.1025 655.2905,334.1025 L704.8025,334.1025 L661.6145,138.4655 Z"
                                    />
                                </g>
                            </svg>
                        {:else if brand === "mastercard"}
                            <svg
                                class="h-6 w-auto"
                                viewBox="0 0 48 32"
                                fill="none"
                            >
                                <circle cx="18" cy="16" r="10" fill="#EB001B" />
                                <circle
                                    cx="30"
                                    cy="16"
                                    r="10"
                                    fill="#F79E1B"
                                    opacity="0.9"
                                />
                                <path
                                    d="M24 8.5C21 10.8 19 13.1 19 16C19 18.9 21 21.2 24 23.5C27 21.2 29 18.9 29 16C29 13.1 27 10.8 24 8.5Z"
                                    fill="#FF5F00"
                                    opacity="0.8"
                                />
                            </svg>
                        {/if}
                    </div>
                </div>
            </div>

            <!-- Expiry + CVC -->
            <div class="flex gap-3">
                <div class="flex-1">
                    <label class="text-xs text-gray-500" for="expiry"
                        >Expiry</label
                    >
                    <input
                        name="expiry"
                        placeholder="MM/YY"
                        oninput={onExpiryInput}
                        class="mt-1 w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
                    />
                </div>

                <div class="flex-1">
                    <label class="text-xs text-gray-500" for="cvc">CVC</label>
                    <input
                        name="cvc"
                        placeholder="123"
                        oninput={onCvcInput}
                        class="mt-1 w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
                    />
                </div>
            </div>

            <!-- Pay -->
            <button
                formaction="?/pay"
                class="w-full py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 active:scale-[0.99] transition"
            >
                Pay {data.payment.amount} PLN
            </button>

            <p class="text-xs text-center text-gray-400 pt-2">
                Secure encrypted transaction
            </p>
        </form>
    </div>
</div>
