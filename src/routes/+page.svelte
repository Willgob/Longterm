<script>
    let backgroundUrl = 'https://cdn.hackclub.com/01a079da-fbe5-78dc-b23e-6b27f98966e9/Group%2029.png';
    import Nav from '$lib/components/Nav.svelte';
</script>

<div class="min-h-screen w-full overflow-auto">
    <img src={backgroundUrl} alt="" class="block h-auto w-auto min-w-full max-w-none" />
    <Nav />
</div> 