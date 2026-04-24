<script lang="ts">
    import {enhance} from "$app/forms";

    let {
        doctorChoose = true,
        doctorList = [],
        error = "",
    } = $props();

    const inputClass = "bg-secondary border border-transparent rounded-lg px-3 py-2.5 text-sm text-primary outline-none focus:border-primary/40 transition-colors";
    const labelClass = "flex flex-col gap-1.5";
    const labelTextClass = "text-primary/60 text-sm";
</script>

<div class="bg-white p-5">
    <form method="POST" action="?/book" use:enhance class="flex flex-col gap-4">
        {#if doctorChoose}
            <label class="flex flex-col gap-1.5">
                <span class="text-primary/60 text-sm">Choose doctor</span>
                <select name="doctorId" class={inputClass} required>
                    <option value="">Select a doctor</option>
                    {#each doctorList as doctor}
                        <option value={doctor.id}>{doctor.firstName} {doctor.lastName}</option>
                    {/each}
                </select>
            </label>
        {/if}

        <label class={labelClass}>
            <span class={labelTextClass}>Date and hour</span>
            <input name="datetime" type="datetime-local" required class={inputClass} step="3600"/>
        </label>

        <label class={labelClass}>
            <span class={labelTextClass}>Description (optional)</span>
            <input name="description" type="text" class={inputClass}/>
        </label>

        {#if error}
            <div class="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
                {error}
            </div>
        {/if}

        <button type="submit"
                class="bg-primary text-white font-semibold text-sm py-3 rounded-lg mt-2 hover:bg-primary/90 transition-colors">
            Book
        </button>
    </form>
</div>