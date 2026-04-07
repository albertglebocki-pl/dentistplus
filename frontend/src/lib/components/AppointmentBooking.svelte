<script lang="ts">
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();
    let doctorId = $state<number | null>(null);
    let datetime = $state("");
    let description = $state("");

    function submit() {
        dispatch("submit", {
            doctorId,
            datetime,
            description
        })
    }

    function handleSubmit(e) {
        e.preventDefault();
        submit();
    }

    let {
        doctorChoose = true,
        doctorList = []
    } = $props();

    const inputClass =
        "bg-secondary border border-transparent rounded-lg px-3 py-2.5 text-sm text-primary outline-none focus:border-primary/40 transition-colors";
    const labelClass = "flex flex-col gap-1.5";
    const labelTextClass = "text-primary/60 text-sm";
</script>

<div class="bg-white p-5">
    <form onsubmit={handleSubmit} method="POST" class="flex flex-col gap-4">
        {#if doctorChoose}
            <label class={labelClass}>
                <span class={labelTextClass}>Choose doctor</span>
                <select name="doctors" id="doctors" class={inputClass} bind:value={doctorId}>
                    {#each doctorList as doctor}
                        <option value={doctor.id}>{doctor.firstName} {doctor.lastName}</option>
                    {/each}
                </select>
            </label>
        {/if}

        <label class={labelClass}>
            <span class={labelTextClass}>Date and hour</span>
            <input
                    type="datetime-local"
                    name="datetime"
                    required
                    class={inputClass}
                    step="3600"
                    bind:value={datetime}
            />
        </label>

        <label class={labelClass}>
            <span class={labelTextClass}>Description (optional)</span>
            <input
                    type="text"
                    name="description"
                    class={inputClass}
                    bind:value={description}
            />
        </label>

        <button
                type="submit"
                class="bg-primary text-white font-semibold text-sm py-3 rounded-lg mt-2 hover:bg-primary/90 transition-colors"
        >
            Book
        </button>
    </form>
</div>