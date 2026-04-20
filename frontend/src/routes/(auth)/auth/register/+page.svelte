<script lang="ts">
    let step = $state(1);
    let email = $state("");
    let password = $state("");
    let confirm = $state("");

    let error = $state("");

    const inputClass =
        "bg-secondary border border-transparent rounded-lg px-3 py-2.5 text-sm text-primary outline-none focus:border-primary/40 transition-colors";
    const labelClass = "flex flex-col gap-1.5";
    const labelTextClass = "text-primary/60 text-sm";

    const handleSubmit = async (e: SubmitEvent): Promise<void> => {
        error = "";

        const formEl = e.currentTarget as HTMLFormElement;
        const formData = new FormData(formEl);

        const data = processData(formData);
        if (!data) return;

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (!res.ok) {
            error = result.error || "Something went wrong";
            return;
        }

        console.log(result);
    };

    const processData = (formData: FormData) => {
        const data = Object.fromEntries(formData);
        console.log(data);

        let nameParts = String(data.fullName).trim().split(" ").filter(el => el != '')
        const firstName = nameParts[0];
        const lastName = nameParts[1];

        const preProcessedData = {
            email: data.email,
            password: data.password,
            confirm: data.confirm,
            firstName: firstName,
            lastName: lastName,
            address: data.address,
            phoneNumber: data.phoneNumber,
        }

        if (validate(preProcessedData)) {
            return {
                email: data.email,
                password: data.password,
                firstName: firstName,
                lastName: lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
            };
        }

        return null;
    }

    const validate = (data: any): boolean => {
        if(!data.firstName || !data.lastName) {
            error = "Enter valid first and last name";
            return false;
        }

        if(data.password != data.confirm) {
            error = "Passwords are different"
            return false;
        }

        return true;
    }
</script>

<main class="min-h-screen bg-secondary flex items-center justify-center px-4">
    <div
            class="bg-white border border-primary/20 rounded-2xl p-10 w-full max-w-sm shadow-sm"
    >
        <h1 class="text-primary text-2xl font-semibold text-center mb-1">
            Dentist+
        </h1>
        <hr class="border-primary/20 mb-6"/>

        {#if error}
            <p class="text-red-500 text-sm text-center mb-4">{error}</p>
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
            <form
                    onsubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(e);
                }}
                    class="flex flex-col gap-4"
            >
                <input type="hidden" name="email" value={email}/>
                <input type="hidden" name="password" value={password}/>
                <input type="hidden" name="confirm" value={confirm}/>

                {#each [
                    {label: "Full Name", name: "fullName", type: "text"},
                    {label: "Address", name: "address", type: "text"},
                    {label: "Phone Number", name: "phoneNumber", type: "tel"}
                ] as field}
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
