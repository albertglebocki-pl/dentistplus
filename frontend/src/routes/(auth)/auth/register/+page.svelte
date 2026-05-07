<script lang="ts">
    import {enhance} from "$app/forms";

    const inputClass =
        "bg-secondary border border-transparent rounded-lg px-3 py-2.5 text-sm text-primary outline-none focus:border-primary/40 transition-colors";
    const labelClass = "flex flex-col gap-1.5";
    const labelTextClass = "text-primary/60 text-sm";

    let {form} = $props();

    let step = $state(1);
    let email = $state("");
    let password = $state("");
    let confirm = $state("");
    let fullName = $state("");
    let address = $state("");
    let phoneNumber = $state("");
</script>

<main class="min-h-screen bg-secondary flex items-center justify-center px-4">
    <div
            class="bg-white border border-primary/20 rounded-2xl p-10 w-full max-w-sm shadow-sm"
    >
        <h1 class="text-primary text-2xl font-semibold text-center mb-1">
            Dentist+
        </h1>
        <hr class="border-primary/20 mb-6"/>

        {#if form?.error}
            <p class="text-red-500 text-sm text-center mb-4">{form?.error}</p>
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
            <form method="POST" use:enhance class="flex flex-col gap-4"
            >
                <input type="hidden" name="email" value={email}/>
                <input type="hidden" name="password" value={password}/>
                <input type="hidden" name="confirm" value={confirm}/>

                <label class={labelClass}>
                    <span class={labelTextClass}>Full Name</span>
                    <input type="text" name="fullName" bind:value={fullName} required class={inputClass} />
                </label>

                <label class={labelClass}>
                    <span class={labelTextClass}>Address</span>
                    <input type="text" name="address" bind:value={address} required class={inputClass} />
                </label>

                <label class={labelClass}>
                    <span class={labelTextClass}>Phone Number</span>
                    <input type="tel" name="phoneNumber" bind:value={phoneNumber} required class={inputClass} />
                </label>

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
