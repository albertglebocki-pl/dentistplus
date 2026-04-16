<script>
    import Sidebar from "../shared/Sidebar.svelte";
    import Calendar from "../doctor/Calendar.svelte";
    import AppointmentBooking from "../doctor/AppointmentBooking.svelte";
    import PatientPreview from "../doctor/PatientPreview.svelte";

    let weekStart = $state(new Date());

    const { data } = $props();

    let calendarData = $state({
        0: { taken: [9], mine: [] },
        1: { taken: [10], mine: [11] },
        2: { taken: [], mine: [14] },
        3: { taken: [], mine: [] },
        4: { taken: [], mine: [] },
    });

    function prevWeek() {
        weekStart = new Date(weekStart.setDate(weekStart.getDate() - 7));
    }

    function nextWeek() {
        weekStart = new Date(weekStart.setDate(weekStart.getDate() + 7));
    }
</script>

<div class="flex">
    <Sidebar items={[{ icon: "📅" }, { icon: "➕" }, { icon: "👤" }]} />

    <div class="flex-1 grid grid-cols-12 gap-4 p-6">
        <div class="col-span-4 space-y-4">
            <div class="bg-white border rounded-xl p-4">
                <h2 class="font-semibold text-primary mb-3">
                    Book appointment
                </h2>

                <AppointmentBooking
                    doctorChoose={false}
                    doctorList={[]}
                    onsubmit={(d) => console.log(d)}
                />
            </div>

            <PatientPreview />
        </div>

        <div class="col-span-8 bg-white border rounded-xl p-4">
            <Calendar
                {calendarData}
                {weekStart}
                onPreviousWeek={prevWeek}
                onNextWeek={nextWeek}
            />
        </div>
    </div>
</div>
