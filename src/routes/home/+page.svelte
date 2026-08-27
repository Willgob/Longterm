<script lang="ts">
	let { data } = $props();
	const formatTime = (timestamp: number | null) => timestamp ? new Date(timestamp * 1000).toLocaleString() : '';
</script>

<section class="mx-auto max-w-4xl space-y-6">
	<header>
		<p class="text-sm font-bold tracking-wide text-accent-600 uppercase">Longterm dashboard</p>
		<h1 class="mt-1 text-4xl font-extrabold">Welcome, {data.displayName}</h1>
		<p class="mt-2 text-text-700">Permissions: <strong>{data.user.perms.join(', ').replaceAll('-', ' ')}</strong> · {data.goldBars.toLocaleString()} clocks</p>
	</header>

	<section class="rounded-2xl border-2 p-6 {data.strikes === 0 ? 'border-green-500 bg-green-50' : 'border-red-400 bg-red-50'}">
		<h2 class="text-2xl font-bold">Strike status: {data.strikes}</h2>
		{#if data.access.programBanPermanent}
			<p class="mt-2">Four strikes: you are permanently banned from the program.</p>
		{:else if data.access.programBanActive}
			<p class="mt-2">Three strikes: program access is paused until {formatTime(data.access.programBannedUntil)}.</p>
		{:else if data.access.shopBanActive}
			<p class="mt-2">Two strikes: shop access is paused until {formatTime(data.access.shopBannedUntil)}.</p>
		{:else if data.strikes === 1}
			<p class="mt-2">One strike: this is a warning. A second strike pauses shop access for one week.</p>
		{:else}
			<p class="mt-2">No warnings or bans are active.</p>
		{/if}
		<ol class="mt-4 grid gap-2 text-sm md:grid-cols-4"><li>1 — Warning</li><li>2 — Shop ban (1 week)</li><li>3 — Program ban (1 week)</li><li>4 — Permanent program ban</li></ol>
	</section>
</section>
