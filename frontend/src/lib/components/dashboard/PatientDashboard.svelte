<script>
    import Sidebar from "../shared/Sidebar.svelte";
    import DentalChart from "../patient/DentalChart.svelte";
    import ToothDetailsPanel from "../patient/ToothDetailsPanel.svelte";
    import TreatmentTimeline from "../patient/TreatmentTimeline.svelte";
    import PatientSummary from "../patient/PatientSummary.svelte";

    const { data } = $props();

    let selectedTooth = $state(null);
</script>

<div class="flex">
    <Sidebar items={[{ icon: "🦷" }, { icon: "📊" }, { icon: "👤" }]} />

    <div class="flex-1 grid grid-cols-12 gap-4 p-6">
        <div class="col-span-3 space-y-4">
            <PatientSummary />
            <TreatmentTimeline />
        </div>

        <div class="col-span-6 bg-white border rounded-xl p-4">
            <DentalChart bind:selectedTooth />
        </div>

        <div class="col-span-3">
            <ToothDetailsPanel {selectedTooth} />
        </div>
    </div>
</div>
