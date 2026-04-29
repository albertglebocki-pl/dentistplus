<script lang="ts">
    let { data } = $props();

    let files: FileList | null = $state(null);
    const file = $derived(files?.[0] ?? null);
    let patientId = $state(1);
    let status = $state("");
    let images: any[] = $state([]);
    let loading = $state(false);

    async function upload() {
        const currentFile = file;
        if (!currentFile) return;
        loading = true;
        status = "Uploading...";
        try {
            const form = new FormData();
            form.append("file", currentFile);
            const res = await fetch(`/api/patients/${patientId}/images`, {
                method: "POST",
                headers: { Authorization: `Bearer ${data.token}` },
                body: form,
            });

            const text = await res.text();

            let data2;
            try {
                data2 = JSON.parse(text);
            } catch {
                throw new Error(text || "Invalid server response");
            }

            if (!res.ok) throw new Error(data2.error ?? "Upload failed");
            status = `✅ Uploaded: ${data2.filename} (id: ${data2._id})`;
            await loadImages();
        } catch (e: any) {
            status = `❌ Error: ${e.message}`;
        } finally {
            loading = false;
        }
    }

    async function loadImages() {
        loading = true;
        try {
            const res = await fetch(`/api/patients/${patientId}/images`, {
                headers: { Authorization: `Bearer ${data.token}` },
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error ?? "Failed to load");
            images = result;
        } catch (e: any) {
            status = `❌ Error loading images: ${e.message}`;
        } finally {
            loading = false;
        }
    }
</script>

<main
    style="max-width: 600px; margin: 40px auto; font-family: sans-serif; padding: 0 20px;"
>
    <h1>Storage Test</h1>
    <label>
        Patient ID:
        <input
            type="number"
            bind:value={patientId}
            min="1"
            style="margin-left: 8px; width: 80px;"
        />
    </label>
    <hr />
    <h2>Upload Image</h2>
    <input type="file" accept="image/jpeg,image/png,image/webp" bind:files />
    <br /><br />
    <button onclick={upload} disabled={!file || loading}>
        {loading ? "Working..." : "Upload"}
    </button>
    {#if status}
        <p>{status}</p>
    {/if}
    <hr />
    <h2>Images for Patient {patientId}</h2>
    <button onclick={loadImages} disabled={loading}>Load Images</button>
    {#if images.length === 0}
        <p>No images yet.</p>
    {:else}
        <div
            style="display: flex; flex-wrap: wrap; gap: 12px; margin-top: 16px;"
        >
            {#each images as img}
                <div
                    style="border: 1px solid #ccc; padding: 8px; border-radius: 4px; width: 180px;"
                >
                    <img
                        src={img.url}
                        alt={img.filename}
                        style="width: 100%; height: 120px; object-fit: cover;"
                    />
                    <p style="font-size: 12px; margin: 4px 0;">
                        {img.filename}
                    </p>
                    <p style="font-size: 11px; color: #666;">
                        {new Date(img.createdAt).toLocaleString()}
                    </p>
                </div>
            {/each}
        </div>
    {/if}
</main>
