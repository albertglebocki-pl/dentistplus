<script lang="ts">
    import Card from "$lib/components/utils/Card.svelte";
    import CardTitle from "$lib/components/utils/CardTitle.svelte";

    let { data, form } = $props();

    const user = $derived(data.user);

    const role = $derived(user.role);

    const createdAt = $derived(
        user.createdAt ? new Date(user.createdAt) : null,
    );

    const inputClass =
        "bg-secondary border border-transparent rounded-lg px-3 py-2.5 text-sm text-primary outline-none focus:border-primary/40 transition-colors w-full disabled:opacity-60 disabled:cursor-not-allowed";

    const labelClass = "flex flex-col gap-1.5";
    const labelTextClass = "text-primary/60 text-sm";

    let editMode = $state(false);

    let formState = $state({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        phoneNumber: "",
    });

    $effect(() => {
        const u = user;

        formState = {
            firstName: u.firstName ?? "",
            lastName: u.lastName ?? "",
            email: u.email ?? "",
            address: u.address ?? "",
            phoneNumber: u.phoneNumber ?? "",
        };
    });

    const isDirty = $derived.by(() => {
        return (
            formState.firstName !== (user.firstName ?? "") ||
            formState.lastName !== (user.lastName ?? "") ||
            formState.email !== (user.email ?? "") ||
            formState.address !== (user.address ?? "") ||
            formState.phoneNumber !== (user.phoneNumber ?? "")
        );
    });

    const canSave = $derived(editMode && isDirty);
</script>

<div class="flex flex-col gap-5 mt-3">
    <Card style={"full"}>
        <div class="flex justify-between items-center">
            <CardTitle text="My Account" />

            <div class="flex gap-2">
                {#if !editMode}
                    <button
                        type="button"
                        class="bg-primary text-white px-3 py-1.5 text-xs rounded"
                        onclick={() => (editMode = true)}
                    >
                        Edit
                    </button>
                {:else}
                    <button
                        type="button"
                        class="bg-secondary text-primary px-3 py-1.5 text-xs rounded"
                        onclick={() => {
                            editMode = false;
                            formState = {
                                firstName: user.firstName ?? "",
                                lastName: user.lastName ?? "",
                                email: user.email ?? "",
                                address: user.address ?? "",
                                phoneNumber: user.phoneNumber ?? "",
                            };
                        }}
                    >
                        Cancel
                    </button>
                {/if}
            </div>
        </div>

        <form
            method="POST"
            action="?/updateProfile"
            class="grid grid-cols-2 gap-4 mt-4"
        >
            <label class={labelClass}>
                <span class={labelTextClass}>First name</span>
                <input
                    class={inputClass}
                    name="firstName"
                    bind:value={formState.firstName}
                    disabled={!editMode}
                />
            </label>

            <label class={labelClass}>
                <span class={labelTextClass}>Last name</span>
                <input
                    class={inputClass}
                    name="lastName"
                    bind:value={formState.lastName}
                    disabled={!editMode}
                />
            </label>

            <label class="col-span-2 flex flex-col gap-1.5">
                <span class={labelTextClass}>Email</span>
                <input
                    class={inputClass}
                    name="email"
                    type="email"
                    bind:value={formState.email}
                    disabled={!editMode}
                />
            </label>

            <label class="col-span-2 flex flex-col gap-1.5">
                <span class={labelTextClass}>Address</span>
                <input
                    class={inputClass}
                    name="address"
                    bind:value={formState.address}
                    disabled={!editMode}
                />
            </label>

            <label class="col-span-2 flex flex-col gap-1.5">
                <span class={labelTextClass}>Phone number</span>
                <input
                    class={inputClass}
                    name="phoneNumber"
                    bind:value={formState.phoneNumber}
                    disabled={!editMode}
                />
            </label>

            <div class="col-span-2 flex justify-end mt-2 gap-2">
                <button
                    class={`px-4 py-2 rounded-lg text-white text-sm transition ${
                        canSave
                            ? "bg-primary hover:opacity-90"
                            : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!canSave}
                >
                    Save changes
                </button>
            </div>
        </form>

        {#if form?.error}
            <p class="text-red-500 text-sm mt-3">{form.error}</p>
        {/if}

        {#if form?.success}
            <p class="text-green-600 text-sm mt-3">
                Profile updated successfully
            </p>
        {/if}
    </Card>

    <Card style={"full"}>
        <div class="grid grid-cols-2 gap-4 mt-4 text-sm">
            <div class="flex flex-col gap-1">
                <span class="text-primary/60 text-xs">Role</span>
                <span class="px-2 py-1 rounded bg-secondary text-primary w-fit">
                    {role}
                </span>
            </div>

            <div class="flex flex-col gap-1">
                <span class="text-primary/60 text-xs">Status</span>
                <span class="px-2 py-1 rounded bg-secondary text-primary w-fit">
                    {user.active ? "Active" : "Blocked"}
                </span>
            </div>

            <div class="flex flex-col gap-1 col-span-2">
                <span class="text-primary/60 text-xs">Created at</span>
                <span class="text-primary">
                    {createdAt
                        ? createdAt.toLocaleDateString("pl-PL", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                          })
                        : "—"}
                </span>
            </div>
        </div>
    </Card>
</div>
