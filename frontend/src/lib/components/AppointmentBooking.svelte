<script>
    let { doctorChoose = true} = $props();

    const inputClass =
        "bg-secondary border border-transparent rounded-lg px-3 py-2.5 text-sm text-primary outline-none focus:border-primary/40 transition-colors";
    const labelClass = "flex flex-col gap-1.5";
    const labelTextClass = "text-primary/60 text-sm";
</script>

<div class="bg-white p-5">
    <form method="POST" class="flex flex-col gap-4">
        {#if doctorChoose}
            <label class={labelClass}>
                <span class={labelTextClass}>Choose doctor</span>
                <select name="doctors" id="doctors" class={inputClass}>
                    <option value="d1">Doctor One</option>
                    <option value="d2">Doctor Two</option>
                    <option value="d3">Doctor Three</option>
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
            />
        </label>

        <label class={labelClass}>
            <span class={labelTextClass}>Description (optional)</span>
            <input
                    type="text"
                    name="description"
                    class={inputClass}
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