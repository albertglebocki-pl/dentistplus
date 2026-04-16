<script>
    import Sidebar from "../shared/Sidebar.svelte";
    import DoctorsTable from "../admin/DoctorsTable.svelte";
    import PatientsTable from "../admin/PatientsTable.svelte";
    import ProceduresTable from "../admin/ProceduresTable.svelte";

    let tab = $state("doctors");
</script>

<div class="flex">
    <Sidebar items={[{ icon: "👨‍⚕️" }, { icon: "🧑" }, { icon: "💊" }]} />

    <div class="flex-1 p-6 space-y-4">
        <div class="flex gap-2">
            <button
                class="px-3 py-2 bg-primary text-white rounded"
                on:click={() => (tab = "doctors")}>Doctors</button
            >
            <button
                class="px-3 py-2 bg-secondary rounded"
                on:click={() => (tab = "patients")}>Patients</button
            >
            <button
                class="px-3 py-2 bg-secondary rounded"
                on:click={() => (tab = "procedures")}>Procedures</button
            >
        </div>

        {#if tab === "doctors"}
            <DoctorsTable />
        {:else if tab === "patients"}
            <PatientsTable />
        {:else}
            <ProceduresTable />
        {/if}
    </div>
</div>
