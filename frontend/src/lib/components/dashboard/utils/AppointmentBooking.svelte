<script lang="ts">
    import {enhance} from "$app/forms";

    let {
        doctorChoose = true,
        doctorList = [],
        // onsubmit,
        // errorMessage = $bindable(""),
    } = $props();


    let datetime = $state("");
    let errorMessage = $state("");

    console.log(doctorList)

    // let doctorId = $state<number | null>(null);
    // let datetime = $state("");
    // let description = $state("");
    //
    // function validate() {
    //     if (!datetime) return "Please select a date and time.";
    //
    //     const date = new Date(datetime);
    //
    //     const day = (date.getDay() + 6) % 7; // Monday is 0
    //     const hour = date.getHours();
    //
    //     if (day >= 5) {
    //         return "Appointments are only available from Monday to Friday.";
    //     }
    //
    //     if (hour < 8 || hour > 18) {
    //         return "Appointments must be between 08:00 and 18:00.";
    //     }
    //
    //     return "";
    // }

    // function handleSubmit(e: Event) {
    //     e.preventDefault();
    //
    //     const error = validate();
    //     if (error) {
    //         errorMessage = error;
    //         return;
    //     }
    //
    //     errorMessage = "";
    //     onsubmit?.({
    //         doctorId,
    //         datetime,
    //         description
    //     });
    // }

    const inputClass = "bg-secondary border border-transparent rounded-lg px-3 py-2.5 text-sm text-primary outline-none focus:border-primary/40 transition-colors";
    const labelClass = "flex flex-col gap-1.5";
    const labelTextClass = "text-primary/60 text-sm";
</script>

<div class="bg-white p-5">
    <form method="POST" action="?/book" use:enhance class="flex flex-col gap-4">
        {#if doctorChoose}
            <label class="flex flex-col gap-1.5">
                <span class="text-primary/60 text-sm">Choose doctor</span>
                <select name="doctorId" class="..." required>
                    <option value="">Select a doctor</option>
                    {#each doctorList as doctor}
                        <option value={doctor.id}>{doctor.firstName} {doctor.lastName}</option>
                    {/each}
                </select>
            </label>
        {/if}

        <label class={labelClass}>
            <span class={labelTextClass}>Date and hour</span>
            <input type="datetime-local" required class={inputClass} step="3600" bind:value={datetime}/>
        </label>

        <!--        <label class={labelClass}>-->
        <!--            <span class={labelTextClass}>Description (optional)</span>-->
        <!--            <input type="text" class={inputClass} bind:value={description}/>-->
        <!--        </label>-->

        <!--{#if errorMessage}-->
        <!--    <div class="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">-->
        <!--        {errorMessage}-->
        <!--    </div>-->
        <!--{/if}-->

        <button type="submit"
                class="bg-primary text-white font-semibold text-sm py-3 rounded-lg mt-2 hover:bg-primary/90 transition-colors">
            Book
        </button>
    </form>
</div>