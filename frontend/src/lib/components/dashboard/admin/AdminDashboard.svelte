<script lang="ts">
    import Card from "$lib/components/utils/Card.svelte";
    import CardTitle from "$lib/components/utils/CardTitle.svelte";

    let { data } = $props();

    let openUserId: number | null = $state(null);
    let showDoctorModal = $state(false);
    let showProcedureModal = $state(false);
    let showInactiveProcedures = $state(false);

    function toggleDetails(id: number) {
        openUserId = openUserId === id ? null : id;
    }

    const activeProcedures = $derived(
        data.data.procedures.filter((p: any) => p.active),
    );

    const inactiveProcedures = $derived(
        data.data.procedures.filter((p: any) => !p.active),
    );
</script>

<div class="flex flex-col gap-2">
    <Card style={"full"}>
        <div class="flex justify-between items-center">
            <CardTitle text="Users" />

            <button
                type="button"
                onclick={() => (showDoctorModal = true)}
                class="bg-primary text-white text-xs px-3 py-1 rounded hover:opacity-90"
            >
                + Add Doctor
            </button>
        </div>

        <div class="overflow-x-auto mt-4">
            <table class="w-full text-sm text-left border-collapse">
                <thead>
                    <tr class="border-b">
                        <th class="py-2 px-3">ID</th>
                        <th class="py-2 px-3">Email</th>
                        <th class="py-2 px-3">Role</th>
                        <th class="py-2 px-3">Status</th>
                        <th class="py-2 px-3">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {#each data.data.users.users.filter((u: any) => u.role !== "ADMIN") as user}
                        <tr class="border-b hover:bg-secondary">
                            <td class="py-2 px-3">{user.id}</td>
                            <td class="py-2 px-3">{user.email}</td>

                            <td class="py-2 px-3">
                                <span
                                    class="px-2 py-1 rounded text-xs bg-secondary text-primary"
                                >
                                    {user.role}
                                </span>
                            </td>

                            <td class="py-2 px-3">
                                <span
                                    class={`px-2 py-1 rounded text-xs ${
                                        user.active
                                            ? "bg-secondary text-primary"
                                            : "bg-gray-200 text-gray-600"
                                    }`}
                                >
                                    {user.active ? "Active" : "Blocked"}
                                </span>
                            </td>

                            <td class="py-2 px-3 flex gap-2">
                                <button
                                    type="button"
                                    onclick={() => toggleDetails(user.id)}
                                    class="text-xs px-2 py-1 rounded bg-secondary text-primary"
                                >
                                    {openUserId === user.id
                                        ? "Hide"
                                        : "Details"}
                                </button>

                                <form method="POST">
                                    <input
                                        type="hidden"
                                        name="userId"
                                        value={user.id}
                                    />
                                    <input
                                        type="hidden"
                                        name="active"
                                        value={user.active}
                                    />

                                    <button
                                        type="submit"
                                        formaction="?/toggleUser"
                                        class={`px-3 py-1 text-xs rounded ${
                                            user.active
                                                ? "bg-secondary text-primary"
                                                : "bg-primary text-white"
                                        }`}
                                    >
                                        {user.active ? "Block" : "Unblock"}
                                    </button>
                                </form>
                            </td>
                        </tr>

                        {#if openUserId === user.id}
                            <tr class="bg-secondary border-b">
                                <td
                                    colspan="5"
                                    class="p-4 text-sm text-primary"
                                >
                                    <div class="grid grid-cols-2 gap-2">
                                        <div>
                                            <strong>Name:</strong>
                                            {user.firstName}
                                            {user.lastName}
                                        </div>
                                        <div>
                                            <strong>Phone:</strong>
                                            {user.phoneNumber || "—"}
                                        </div>
                                        <div class="col-span-2">
                                            <strong>Address:</strong>
                                            {user.address || "—"}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        {/if}
                    {/each}
                </tbody>
            </table>
        </div>
    </Card>

    <Card style={"full"}>
        <div class="flex justify-between items-center">
            <CardTitle text="Medical Procedures" />

            <button
                type="button"
                onclick={() => (showProcedureModal = true)}
                class="bg-primary text-white text-xs px-3 py-1 rounded hover:opacity-90"
            >
                + Add Procedure
            </button>
        </div>

        <div class="overflow-x-auto mt-4">
            {#if activeProcedures.length === 0}
                <div
                    class="text-center py-10 text-primary bg-secondary rounded"
                >
                    Nothing to see
                </div>
            {:else}
                <table class="w-full text-sm text-left border-collapse">
                    <thead>
                        <tr class="border-b">
                            <th class="py-2 px-3">Name</th>
                            <th class="py-2 px-3">Description</th>
                            <th class="py-2 px-3">Cost</th>
                            <th class="py-2 px-3">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {#each activeProcedures as p}
                            <tr class="border-b hover:bg-secondary">
                                <td class="py-2 px-3 font-medium">{p.name}</td>
                                <td class="py-2 px-3">{p.description || "—"}</td
                                >
                                <td class="py-2 px-3">{p.defaultCost} zł</td>

                                <td class="py-2 px-3">
                                    <form method="POST">
                                        <input
                                            type="hidden"
                                            name="id"
                                            value={p._id}
                                        />

                                        <button
                                            formaction="?/deactivateProcedure"
                                            class="text-xs px-2 py-1 rounded bg-primary text-white"
                                        >
                                            Delete
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            {/if}

            {#if inactiveProcedures.length > 0}
                <button
                    type="button"
                    onclick={() =>
                        (showInactiveProcedures = !showInactiveProcedures)}
                    class="mt-4 w-full text-center text-xs px-3 py-2 rounded bg-secondary text-primary hover:opacity-90"
                >
                    {showInactiveProcedures
                        ? "Hide deleted procedures"
                        : "Show deleted procedures"}
                </button>
            {/if}

            {#if showInactiveProcedures && inactiveProcedures.length > 0}
                <div class="my-6 flex items-center gap-4">
                    <div class="flex-1 h-px bg-secondary"></div>
                    <div class="flex-1 h-px bg-secondary"></div>
                </div>

                <table class="w-full text-sm text-left border-collapse">
                    <tbody>
                        {#each inactiveProcedures as p}
                            <tr class="border-b bg-secondary">
                                <td class="py-2 px-3">{p.name}</td>
                                <td class="py-2 px-3">{p.description || "—"}</td
                                >
                                <td class="py-2 px-3">{p.defaultCost} zł</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            {/if}
        </div>
    </Card>

    <Card style={"full"}>
        <CardTitle text="Payments" />

        <div class="overflow-x-auto mt-4">
            {#if data.data.payments.length === 0}
                <div
                    class="text-center py-10 text-primary bg-secondary rounded"
                >
                    Nothing to show
                </div>
            {:else}
                <table class="w-full text-sm text-left border-collapse">
                    <thead>
                        <tr class="border-b">
                            <th class="py-2 px-3">ID</th>
                            <th class="py-2 px-3">Patient</th>
                            <th class="py-2 px-3">Procedure</th>
                            <th class="py-2 px-3">Amount</th>
                            <th class="py-2 px-3">Status</th>
                            <th class="py-2 px-3">Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        {#each data.data.payments as payment}
                            <tr class="border-b hover:bg-secondary">
                                <td class="py-2 px-3">{payment._id}</td>
                                <td class="py-2 px-3">{payment.patientId}</td>
                                <td class="py-2 px-3"
                                    >{payment.medicalProcedureId?.name ||
                                        "—"}</td
                                >
                                <td class="py-2 px-3">{payment.amount} zł</td>

                                <td class="py-2 px-3">
                                    <span
                                        class={`px-2 py-1 rounded text-xs ${
                                            payment.status === "PAID"
                                                ? "bg-secondary text-primary"
                                                : "bg-gray-200 text-gray-600"
                                        }`}
                                    >
                                        {payment.status}
                                    </span>
                                </td>

                                <td class="py-2 px-3">
                                    {new Date(
                                        payment.createdAt,
                                    ).toLocaleDateString()}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            {/if}
        </div>
    </Card>
</div>

{#if showDoctorModal}
    <div
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
        <div class="bg-white w-500px p-6 rounded-lg relative">
            <button
                class="absolute top-6 right-6"
                onclick={() => (showDoctorModal = false)}
            >
                ✕
            </button>

            <h2 class="text-lg font-semibold mb-4 text-primary">
                Create Doctor Account
            </h2>

            <form method="POST" class="grid grid-cols-2 gap-3">
                <input
                    name="email"
                    class="border p-2 col-span-2 rounded-md"
                    placeholder="Email"
                />
                <input
                    name="password"
                    type="password"
                    class="border p-2 col-span-2 rounded-md"
                    placeholder="Password"
                />

                <input
                    name="firstName"
                    class="border p-2 rounded-md"
                    placeholder="First name"
                />
                <input
                    name="lastName"
                    class="border p-2 rounded-md"
                    placeholder="Last name"
                />

                <input
                    name="phoneNumber"
                    class="border p-2 col-span-2 rounded-md"
                    placeholder="Phone"
                />

                <div class="col-span-2 flex justify-end gap-6">
                    <button
                        type="button"
                        onclick={() => (showDoctorModal = false)}
                    >
                        Cancel
                    </button>

                    <button
                        formaction="?/createDoctor"
                        class="bg-primary text-white px-3 py-1 rounded"
                    >
                        Create
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}

{#if showProcedureModal}
    <div
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
        <div class="bg-white w-[500px] p-6 rounded-lg relative">
            <button
                class="absolute top-6 right-6"
                onclick={() => (showProcedureModal = false)}
            >
                ✕
            </button>

            <h2 class="text-lg font-semibold mb-4 text-primary">
                Add Procedure
            </h2>

            <form method="POST" class="grid grid-cols-2 gap-3">
                <input
                    name="name"
                    class="border p-2 col-span-2 rounded-md"
                    placeholder="Name"
                />

                <input
                    name="defaultCost"
                    type="number"
                    class="border p-2 col-span-2 rounded-md"
                    placeholder="Cost"
                />

                <textarea
                    name="description"
                    class="border p-2 col-span-2 rounded-md"
                    placeholder="Description"
                ></textarea>

                <div class="col-span-2 flex justify-end gap-6">
                    <button
                        type="button"
                        onclick={() => (showProcedureModal = false)}
                    >
                        Cancel
                    </button>

                    <button
                        formaction="?/createProcedure"
                        class="bg-primary text-white px-3 py-1 rounded"
                    >
                        Create
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
