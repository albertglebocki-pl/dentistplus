<script lang="ts">
    import "../layout.css";

    import type { PageData } from "./$types";

    const { data, children }: { data: PageData; children: any } = $props();
</script>

<nav class="w-full px-4 py-2">
    <div
        class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between text-secondary bg-primary rounded-xl"
    >
        <a href="/dashboard" class="text-xl font-medium"> Dentist+ </a>

        <div class="flex flex-row items-center gap-2">
            <a
                class="w-7 h-7 p-1 rounded-md fill-primary bg-secondary"
                href="/dashboard/account"
                title="Account Settings"
            >
                <svg
                    viewBox="0 0 48 48"
                    data-name="Layer 1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    ><path
                        d="M24,21A10,10,0,1,1,34,11,10,10,0,0,1,24,21ZM24,5a6,6,0,1,0,6,6A6,6,0,0,0,24,5Z"
                    /><path
                        d="M42,47H6a2,2,0,0,1-2-2V39A16,16,0,0,1,20,23h8A16,16,0,0,1,44,39v6A2,2,0,0,1,42,47ZM8,43H40V39A12,12,0,0,0,28,27H20A12,12,0,0,0,8,39Z"
                    /></svg
                >
            </a>

            <a
                class="w-7 h-7 p-1 rounded-md bg-secondary"
                href="/auth/logout"
                title="Logout"
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M21 12L13 12"
                        stroke="#20297c"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M18 15L20.913 12.087V12.087C20.961 12.039 20.961 11.961 20.913 11.913V11.913L18 9"
                        stroke="#20297c"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M16 5V4.5V4.5C16 3.67157 15.3284 3 14.5 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H14.5C15.3284 21 16 20.3284 16 19.5V19.5V19"
                        stroke="#20297c"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </a>
        </div>
    </div>
</nav>

<div class="max-w-5xl mx-auto">
    {@render children()}
</div>
