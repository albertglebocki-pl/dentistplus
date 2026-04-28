<script lang="ts">
    import Card from "$lib/components/utils/Card.svelte";
    import CardTitle from "$lib/components/utils/CardTitle.svelte";

    let { data } = $props();
</script>

<Card style={"full"}>
    <CardTitle text="Users" />

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
                {#each data.data.users.users.filter((user: any) => user.role !== "ADMIN") as user}
                    <tr class="border-b hover:bg-gray-50">
                        <td class="py-2 px-3">{user.id}</td>

                        <td class="py-2 px-3">{user.email}</td>

                        <td class="py-2 px-3">
                            <span
                                class="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700"
                            >
                                {user.role}
                            </span>
                        </td>

                        <td class="py-2 px-3">
                            <span
                                class={`px-2 py-1 rounded text-xs ${
                                    user.active
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                            >
                                {user.active ? "Active" : "Blocked"}
                            </span>
                        </td>

                        <td class="py-2 px-3">
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
                                    class={`px-3 py-1 text-xs rounded transition ${
                                        user.active
                                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                                            : "bg-green-100 text-green-700 hover:bg-green-200"
                                    }`}
                                >
                                    {user.active ? "Block" : "Unblock"}
                                </button>
                            </form>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</Card>
