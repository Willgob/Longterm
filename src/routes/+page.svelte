<script>
    let backgroundUrl = 'https://cdn.hackclub.com/01a07e23-9157-7e04-9e14-5e8b22d98e1a/bg_final%201.svg';
    let logoUrl = 'https://cdn.hackclub.com/01a07e18-6df0-7df2-a441-69b4ff6558fb/logo20000%202.svg';
    import Nav from '$lib/components/Nav.svelte';
</script>

<div class="min-h-screen w-full overflow-x-hidden overflow-y-auto">
    <img src={backgroundUrl} alt="Background" class="relative -top-30 block h-auto w-auto min-w-full max-w-none origin-top scale-[1.02]" />

    <div class="absolute top-0 left-0 right-0">
        <Nav />
    </div>

    <div class="absolute top-25 left-1/2 flex -translate-x-1/2 flex-col items-center">
        <img src={logoUrl} alt="Logo" />

        <div class="-mt-2 max-w-7xl text-center text-xl leading-[1.35] text-transparent md:text-2xl bg-clip-text [-webkit-background-clip:text]" style="font-family: 'Rye', serif; background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.22) 1px, transparent 0), linear-gradient(#050633, #050633); background-size: 5px 5px, 100% 100%; filter: drop-shadow(0 4px 2px rgba(5, 6, 51, 0.38));">
            A YSWS where you can select a custom prize
            and, using Hackatime, save up for a grant to purchase that very prize!
        </div>

        <a href="https://forms.fillout.com/t/8h6xFBvpFqus" class="mt-4 rounded-lg border-2 border-yellow-500 bg-[#FFE500] px-6 py-3 text-lg font-semibold text-black shadow-md transition hover:bg-[#f0d916] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-400">
            RSVP
        </a>
    </div>

    <div id="faq">
        <p>dfjaksdlfkjasld</p>
    </div>
    
</div> 