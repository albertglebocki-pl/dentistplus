<script lang="ts">
    import "../layout.css";
    import favicon from "$lib/assets/favicon.svg";

    const currentYear = new Date().getFullYear();

    let { children } = $props();

    import { onMount } from "svelte";

    let scrolled = $state(false);

    onMount(() => {
        const handleScroll = () => {
            scrolled = window.scrollY > 10;
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    });
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
    <title>Dentist+ | Home</title>
</svelte:head>

<div
    class={`w-full sticky top-0 z-50 transition-all duration-300 ${
        scrolled
            ? "bg-secondary/75 backdrop-blur border-b border-primary/25"
            : "bg-primary"
    }`}
>
    <div class="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <a
            href="/"
            class={`text-xl font-semibold ${scrolled ? "text-primary" : "text-secondary"} tracking-tight hover:opacity-80 transition`}
        >
            Dentist+
        </a>

        <a
            href="/auth/login"
            class="text-sm font-medium text-primary bg-secondary px-4 py-2 border-primary border-1 rounded-xl hover:opacity-90 transition"
        >
            Sign in
        </a>
    </div>
</div>

{@render children()}

<div
    class="flex flex-row w-full bg-primary text-secondary items-center justify-center px-6 py-4"
>
    &copy; {currentYear}&nbsp;
    <a href="https://github.com/albertglebocki-pl/dentistplus" target="_blank">
        Dentist+
    </a>
</div>
