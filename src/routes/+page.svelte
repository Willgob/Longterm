<script>
    import Spiral from '$lib/components/spiral.svelte';
</script>
<div class="relative h-16">
    <a href="https://hackclub.com/">
        <img class="absolute top-0 border-0 w-40 z-999" src="https://assets.hackclub.com/flag-orpheus-left.svg" alt="Hack Club"/>
    </a>
    <a
        href="/api/login"
        class="absolute top-3 right-5 flex h-10 w-30 items-center justify-center gap-2 overflow-hidden rounded bg-background-400 font-semibold transition-colors hover:bg-background-500 focus:outline-2 focus:outline-offset-2 focus:outline-background-600"
    >
        Sign Up
    </a>
</div>

<div class="relative flex justify-center flex-col text-center gap-2 mt-12">
    <div class="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div class="w-96 h-96 opacity-50 translate-y-12">
            <Spiral size={280}/>
        </div>
    </div>
    <div class="relative z-10">
        <p class="text-text-600 text-lg font-semibold tracking-wide uppercase mb-8">Hack Club Presents</p>
        <h1 class="uppercase text-6xl sm:text-8xl font-extrabold tracking-tight leading-none">longterm</h1>
        <p class="text-xl text-neutral-600 mt-4">Long time, <span class="text-red-400">big prizes.</span></p>
    </div>
</div>
