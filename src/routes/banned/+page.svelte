<script lang="ts">
	let { data } = $props();
	const formatTime = (timestamp: number | null) => timestamp ? new Date(timestamp * 1000).toLocaleString() : '';
</script>

<section class="mx-auto flex w-full max-w-2xl flex-1 items-center p-6">
	<div class="w-full rounded-2xl border-2 border-red-400 bg-red-50 p-8 text-center text-red-950">
		<p class="text-sm font-bold tracking-wide uppercase">Account status</p>
		{#if data.access.programBanPermanent}
			<h1 class="mt-2 text-4xl font-extrabold">Program access revoked</h1>
			<p class="mt-4">Your account has four strikes and is permanently banned from the program. Contact an administrator if this should be overturned.</p>
		{:else if data.access.programBanActive}
			<h1 class="mt-2 text-4xl font-extrabold">Program access paused</h1>
			<p class="mt-4">You have three strikes. Program access returns on <strong>{formatTime(data.access.programBannedUntil)}</strong>.</p>
		{:else if data.access.shopBanActive}
			<h1 class="mt-2 text-4xl font-extrabold">Shop access paused</h1>
			<p class="mt-4">You have two strikes. Shop access returns on <strong>{formatTime(data.access.shopBannedUntil)}</strong>.</p>
		{:else}
			<h1 class="mt-2 text-4xl font-extrabold">No active ban</h1>
			<p class="mt-4">Your account is not currently banned.</p>
		{/if}
		<p class="mt-6 text-sm">Current strikes: {data.access.strikes}</p>
		<a class="mt-6 inline-block rounded bg-red-700 px-4 py-2 font-bold text-white" href="/api/logout">Log out</a>
	</div>
</section>
