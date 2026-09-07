<script lang="ts">
    const links = [
        // { label: 'Dash', href: '/home'},
        { label: "About", href: '#about'},
        { label: 'FAQ', href: '#faq'}
    ]
</script>

<div class="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-3">
    <div 
    class="w-32 h-10 relative">
    <img src="https://cdn.hackclub.com/01a07a09-a4af-72a1-8047-e355341edd4d/hackClubLogoRed%201.png" alt="Logo" class="w-full h-ful object-contain" />
    </div>

    <nav class="flex gap-10">
        {#each links as link}
        <a href={link.href} class="text-yellow-400 font-extrabold text-xl hover:opacity-80 transition-opacity">{link.label}
        </a>
        {/each}
    </nav>
</div>