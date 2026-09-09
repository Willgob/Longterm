<script>
    let backgroundUrl = 'https://cdn.hackclub.com/01a07e23-9157-7e04-9e14-5e8b22d98e1a/bg_final%201.svg';
    let logoUrl = 'https://cdn.hackclub.com/01a07e18-6df0-7df2-a441-69b4ff6558fb/logo20000%202.svg';
    const faqs = [
        {
            question: 'What is this program?',
            answer: 'This is a YSWS where you can choose a prize and use your Hackatime progress to save up for a grant to buy it.'
        },
        {
            question: 'How do I get started?',
            answer: 'Sign up, track your eligible work with Hackatime, and check your progress as you work toward your chosen prize.'
        },
        {
            question: 'What can I use my grant for?',
            answer: 'Your grant is used to purchase the custom prize you selected, subject to the program rules and approval.'
        }
    ];
    import Nav from '$lib/components/Nav.svelte';
</script>

<div class="relative min-h-screen w-full overflow-x-hidden overflow-y-auto">
    <img src={backgroundUrl} alt="Background" class="pointer-events-none absolute -top-30 left-0 z-0 block h-auto w-auto min-w-full max-w-none origin-top scale-[1.02]" />

    <div class="relative z-10 min-h-screen">
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
    </div>

    <div id="faq" class="relative z-10 mx-auto -mt-48 w-full max-w-5xl px-6 py-67 md:px-10">
        <div class="mb-10 text-center">
            <h2 class="font-[Rye] text-4xl text-[#050633] drop-shadow-[0_3px_1px_rgba(5,6,51,0.25)] md:text-6xl">FAQ</h2>
        </div>

        <div class="space-y-4">
            {#each faqs as faq}
                <details class="group rounded-2xl border-2 border-[#050633]/15 bg-white/45 p-5 shadow-[0_5px_0_rgba(5,6,51,0.12)] backdrop-blur-sm transition hover:bg-white/60">
                    <summary class="flex cursor-pointer list-none items-center justify-between gap-6 font-[Rye] text-xl text-[#050633] marker:hidden md:text-2xl">
                        <span>{faq.question}</span>
                        <span class="text-3xl leading-none transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                    </summary>
                    <p class="mt-4 max-w-3xl border-t border-[#050633]/15 pt-4 text-lg leading-relaxed text-[#050633]/85">{faq.answer}</p>
                </details>
            {/each}
        </div>
    </div>
    
</div> 