<script lang="ts">
	import Modal from '$lib/components/modal.svelte';
	import Request from '$lib/components/Request.svelte';

	let { data, form } = $props();
	let showModal = $state(false);
	const activeItem = $derived(data.items.find((item) => item.status === 'approved'));
	const approvedPrice = $derived(activeItem?.price ?? 0);
	const progress = $derived(approvedPrice > 0 ? Math.min((data.goldBars / approvedPrice) * 100, 100) : 0);

	$effect(() => {
		if (form?.message) showModal = true;
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
		<h2 class="text-2xl">Progress to <span class="font-semibold">{activeItem.name}</span></h2>
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
	{#if data.user.perms === 'fulfillment' || data.user.perms === 'admin'}
		<a href="/home/shop/orders" class="cursor-pointer rounded-sm bg-primary-500 px-4 py-2 text-white">Fulfillment</a>
	{/if}
</div>

{#if data.items.length > 0}
	<div class="grid grid-cols-[repeat(auto-fill,minmax(225px,225px))] justify-start gap-4 p-4">
		{#each data.items as item}
			<article class="flex h-96 w-56.25 flex-col items-center justify-between rounded-xl border-2 border-background-300 bg-background-200 p-4">
				<div class="w-full">
					<div class="relative mx-auto flex h-40 w-48 items-center justify-center overflow-hidden rounded-xl bg-primary-700/15 p-1">
						<img src={item.hasUploadedImage ? `/api/item-images/${item.id}` : item.imageUrl} alt={item.name} class="block h-full w-full rounded-xl object-contain object-center" />
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
