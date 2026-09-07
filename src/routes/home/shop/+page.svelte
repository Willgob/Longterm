<script lang="ts">
	import Modal from '$lib/components/modal.svelte';
	import Request from '$lib/components/Request.svelte';

	let { data, form } = $props();
	let showModal = $state(false);
	let showProgressMenu = $state(false);
	const approvedItems = $derived(data.items.filter((item) => item.status === 'approved'));
	const activeItem = $derived(approvedItems.find((item) => item.id === data.progressItemId) ?? approvedItems[0]);
	const approvedPrice = $derived(activeItem?.price ?? 0);
	const progress = $derived(approvedPrice > 0 ? Math.min((data.goldBars / approvedPrice) * 100, 100) : 0);

	$effect(() => {
		if (form?.message) showModal = true;
		if (form?.progressError) showProgressMenu = true;
	});

	function statusLabel(status: string) {
		return status.replaceAll('_', ' ').replace(/^./, (letter) => letter.toUpperCase());
	}
</script>

<svelte:head>
	<title>Item shop</title>
</svelte:head>

{#if activeItem}
	<div class="relative mb-4 flex min-h-4 w-full flex-col rounded-lg border-2 border-background-200 p-4">
		<button
			type="button"
			class="absolute top-4 right-4 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-primary-500/40 bg-primary-500/10 px-3 py-1.5 text-sm font-semibold text-primary-700 shadow-sm transition hover:-translate-y-0.5 hover:border-primary-500 hover:bg-primary-500 hover:text-white hover:shadow-md focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-400 active:translate-y-0"
			onclick={() => (showProgressMenu = !showProgressMenu)}
			aria-haspopup="menu"
			aria-expanded={showProgressMenu}
			aria-controls="progress-item-menu"
		>
			<svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 20h9" />
				<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
			</svg>
			Change
		</button>
		{#if showProgressMenu}
			<form
				id="progress-item-menu"
				method="POST"
				action="?/changeProgressItem"
				class="absolute top-14 right-4 z-20 w-72 rounded-xl border border-background-300 bg-background-50 p-2 shadow-xl"
				aria-label="Choose an item to track"
			>
				<p class="px-3 py-2 text-xs font-semibold tracking-wide text-text-700 uppercase">Track progress toward</p>
				<div class="flex max-h-64 flex-col gap-1 overflow-y-auto">
					{#each approvedItems as item}
						<button
							type="submit"
							name="progressItemId"
							value={item.id}
							class="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-primary-500/10 focus-visible:outline-3 focus-visible:outline-offset-1 focus-visible:outline-accent-400 {item.id === activeItem.id ? 'bg-primary-500/15' : ''}"
						>
							<img src={item.imageUrl} alt="" class="size-10 shrink-0 rounded-md bg-background-200 object-contain" />
							<span class="min-w-0 flex-1">
								<span class="block truncate text-sm font-semibold text-text-900">{item.name}</span>
								<span class="block text-xs text-text-700">{item.price?.toLocaleString()} clocks</span>
							</span>
							{#if item.id === activeItem.id}
								<svg class="size-4 shrink-0 text-primary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-label="Currently selected">
									<path stroke-linecap="round" stroke-linejoin="round" d="m5 12 4 4L19 6" />
								</svg>
							{/if}
						</button>
					{/each}
				</div>
				{#if form?.progressError}
					<p class="px-3 pt-2 pb-1 text-xs font-medium text-accent-500">{form.progressError}</p>
				{/if}
			</form>
		{/if}
		<h2 class="pr-28 text-2xl">Progress to <span class="font-semibold">{activeItem.name}</span></h2>
		<p class="mb-3 text-sm">You have {Math.max(approvedPrice - data.goldBars, 0).toLocaleString()} clocks to go!</p>
		<div class="flex w-full justify-between text-xs text-text-950">
			<p class="mt-auto mb-0.5 text-sm text-text-900">Clocks earned</p>
			<p class="mt-auto mb-0.5 text-sm">{data.goldBars.toLocaleString()}/{approvedPrice.toLocaleString()}</p>
		</div>
		<div class="relative h-2 w-full overflow-hidden rounded-full bg-background-200">
			<div class="absolute top-0 left-0 h-full rounded-full bg-primary-600" style="width: {progress}%"></div>
		</div>
	</div>
{:else}
	<div class="mb-4 rounded-lg border-2 border-background-200 p-4">
		<h2 class="text-xl font-semibold">No approved item goal yet</h2>
		<p class="mt-1 text-sm text-text-700">Submit an item request and track its review status below.</p>
	</div>
{/if}

<div class="flex items-center gap-4 p-4">
	<button class="cursor-pointer rounded-sm bg-primary-500 px-4 py-2 text-white" onclick={() => (showModal = true)}>Request Item</button>
	{#if data.user.perms.includes('fulfillment') || data.user.perms.includes('admin')}
		<a href="/home/shop/orders" class="cursor-pointer rounded-sm bg-primary-500 px-4 py-2 text-white">Fulfillment</a>
	{/if}
</div>

{#if data.items.length > 0}
	<div class="grid grid-cols-[repeat(auto-fill,minmax(225px,225px))] justify-start gap-4 p-4">
		{#each data.items as item}
			<article class="flex h-96 w-56.25 flex-col items-center justify-between rounded-xl border-2 border-background-300 bg-background-200 p-4">
				<div class="w-full">
					<div class="relative mx-auto flex h-40 w-48 items-center justify-center overflow-hidden rounded-xl bg-primary-700/15 p-1">
						<img src={item.imageUrl} alt={item.name} class="block h-full w-full rounded-xl object-contain object-center" />
					</div>
					<h2 class="pt-2 text-center text-xl font-semibold text-text-800">{item.name}</h2>
					<p class="line-clamp-3 pt-1 text-center text-xs text-text-800">{item.description}</p>
				</div>

				<div class="flex w-full flex-col gap-2 text-center">
					<p class="text-sm font-semibold text-text-900">{statusLabel(item.status)}</p>
					{#if item.status === 'approved'}
						<p class="rounded-full bg-background-400 px-3 py-2 text-sm">Approved at ${item.price?.toLocaleString()} {item.currency}</p>
					{:else if item.reviewNotes}
						<p class="rounded-lg border border-background-400 p-2 text-xs text-text-800">{item.reviewNotes}</p>
					{:else}
						<p class="rounded-full bg-background-300 px-3 py-2 text-sm">Awaiting review</p>
					{/if}
				</div>
			</article>
		{/each}
	</div>
{:else}
	<div class="m-4 rounded-xl border border-dashed border-background-400 p-8 text-center text-text-700">
		You have not requested any items yet.
	</div>
{/if}

<Modal bind:showModal>
	<Request errorMessage={form?.message ?? ''} onClose={() => (showModal = false)} />
</Modal>
