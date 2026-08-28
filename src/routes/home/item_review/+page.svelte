<script lang="ts">
	let { data, form } = $props();

	const reviewTabs = [
		{ label: 'Pending', status: 'pending' },
		{ label: 'Approved', status: 'approved' },
		{ label: 'Changes requested', status: 'changes_requested' },
		{ label: 'Rejected', status: 'rejected' }
	] as const;

	const fallbackImage =
		'https://cdn.hackclub.com/019f74ff-21f8-7f29-b2a8-916c9afa4d60/testshoop.jpg';
	let finalPrice = $state(0);
	let reviewNotes = $state('');

	$effect(() => {
		finalPrice = data.item?.price ?? data.item?.requestedPrice ?? 0;
		reviewNotes = data.item?.reviewNotes ?? '';
	});
</script>

<svelte:head>
	<title>Item review</title>
	<meta name="description" content="Review item requests and approve, reject, or request changes." />
</svelte:head>

<section class="mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border border-background-400 bg-background-100 shadow-2xl" aria-labelledby="review-heading">
	<nav class="flex gap-2 overflow-x-auto border-b border-accent-500 bg-background-700 px-4 py-3 max-sm:pl-14" aria-label="Item review filters">
		{#each reviewTabs as tab}
			<a
				href="?status={tab.status}"
				class="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold transition hover:bg-background-900 hover:text-text-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-400 {data.selectedStatus === tab.status ? 'border-accent-500 bg-background-900 text-text-900' : 'border-transparent bg-transparent text-text-100'}"
				aria-current={data.selectedStatus === tab.status ? 'page' : undefined}
			>
				{tab.label}
				<span class="grid h-5 min-w-5 place-items-center rounded-full bg-accent-500 px-1 text-xs text-white">
					{data.counts[tab.status]}
				</span>
			</a>
		{/each}
	</nav>

	{#if data.item}
		<form method="POST" class="grid grid-cols-[minmax(240px,34%)_minmax(0,1fr)] gap-8 p-6 md:p-10 lg:gap-16 max-[420px]:grid-cols-1">
			<input type="hidden" name="itemId" value={data.item.id} />

			<div class="aspect-square self-start overflow-hidden rounded-2xl border border-background-400 bg-background-200">
				<img class="block h-full w-full object-cover" src={data.item.imageUrl || fallbackImage} alt={data.item.name} />
			</div>

			<div class="flex min-w-0 flex-col">
				<header>
					<p class="mb-2 text-xs font-extrabold tracking-[0.12em] text-accent-600 uppercase">Item request</p>
					<h1 id="review-heading" class="text-4xl leading-none font-bold tracking-tight text-text-950 md:text-5xl">{data.item.name}</h1>
					<p class="mt-4 max-w-2xl text-base leading-7 text-text-800">
						{data.item.description || 'No description was provided.'}
					</p>
					{#if data.item.specification}
						<p class="mt-2 max-w-2xl text-sm leading-6 text-text-700"><strong>Specification:</strong> {data.item.specification}</p>
					{/if}
				</header>

				<dl class="mt-8 grid gap-3 md:mt-12">
					<div class="grid grid-cols-[minmax(110px,0.35fr)_1fr] items-center gap-4 rounded-xl border border-primary-500 bg-primary-500/10 p-4 max-sm:grid-cols-1">
						<dt class="text-xs font-bold tracking-wide text-text-700 uppercase">Requested by</dt>
						<dd class="m-0 text-lg font-bold text-text-950">
							{data.item.requestedBy || data.item.requesterSlackId}
							<span class="ml-2 text-xs font-semibold text-text-600">{data.item.requesterStrikes} strike{data.item.requesterStrikes === 1 ? '' : 's'}</span>
						</dd>
					</div>
					<div class="grid grid-cols-[minmax(110px,0.35fr)_1fr] items-center gap-4 rounded-xl border border-primary-500 bg-primary-500/10 p-4 max-sm:grid-cols-1">
						<dt class="text-xs font-bold tracking-wide text-text-700 uppercase">Requested price</dt>
						<dd class="m-0 text-lg font-bold text-text-950">${data.item.requestedPrice.toLocaleString()} {data.item.currency}</dd>
					</div>
					{#if data.item.goalDays > 0}
						<div class="grid grid-cols-[minmax(110px,0.35fr)_1fr] items-center gap-4 rounded-xl border border-primary-500 bg-primary-500/10 p-4 max-sm:grid-cols-1">
							<dt class="text-xs font-bold tracking-wide text-text-700 uppercase">Goal</dt>
							<dd class="m-0 text-lg font-bold text-text-950">{data.item.goalDays} days</dd>
						</div>
					{/if}
				</dl>

				{#if form?.message}
					<p class="mt-6 rounded-xl border border-accent-500 bg-accent-500/10 p-3 text-sm font-semibold text-text-950" role="alert">{form.message}</p>
				{/if}

				{#if data.selectedStatus === 'pending'}
					<div class="mt-8 grid gap-5">
						<label class="grid gap-2" for="final-price">
							<span class="text-sm font-bold text-text-900">Final approved price</span>
							<span class="flex overflow-hidden rounded-xl border border-background-400 bg-background-50 focus-within:border-primary-500 focus-within:ring-3 focus-within:ring-primary-500/25">
								<span class="grid place-items-center border-r border-background-400 px-4 font-bold text-text-700" aria-hidden="true">$</span>
								<input id="final-price" name="finalPrice" type="number" min="0" step="1" bind:value={finalPrice} class="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 font-semibold text-text-950 outline-none" required />
								<span class="grid place-items-center px-4 text-sm font-bold text-text-700">{data.item.currency}</span>
							</span>
						</label>

						<label class="grid gap-2" for="review-notes">
							<span class="text-sm font-bold text-text-900">Requested changes or review notes</span>
							<textarea id="review-notes" name="reviewNotes" rows="4" maxlength="2000" bind:value={reviewNotes} placeholder="Explain what needs to be changed before this item can be approved…" class="w-full resize-y rounded-xl border border-background-400 bg-background-50 px-4 py-3 text-text-950 outline-none placeholder:text-text-500 focus:border-primary-500 focus:ring-3 focus:ring-primary-500/25"></textarea>
						</label>
					</div>

					<div class="mt-8 grid grid-cols-3 gap-3 max-sm:grid-cols-1" aria-label="Review actions">
						<button class="min-h-12 cursor-pointer rounded-xl border border-primary-500 bg-transparent px-4 py-3 font-bold text-text-900 transition hover:-translate-y-0.5 hover:bg-primary-500/10 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-400 disabled:cursor-not-allowed disabled:opacity-40" type="submit" formaction="?/requestChanges" disabled={reviewNotes.trim().length < 3}>Request changes</button>
						<button class="min-h-12 cursor-pointer rounded-xl border border-transparent bg-accent-500 px-4 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-400" type="submit" formaction="?/reject">Reject + strike</button>
						<button class="min-h-12 cursor-pointer rounded-xl border border-transparent bg-primary-500 px-4 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-400" type="submit" formaction="?/approve">Approve</button>
					</div>
				{:else}
					<div class="mt-8 grid gap-3 rounded-xl border border-background-400 bg-background-50 p-4">
						<p class="text-sm font-bold text-text-900">Review outcome</p>
						{#if data.item.price !== null}<p class="text-text-800">Final price: <strong>${data.item.price.toLocaleString()} {data.item.currency}</strong></p>{/if}
						<p class="text-text-800">{data.item.reviewNotes || 'No review notes were provided.'}</p>
					</div>
				{/if}
			</div>
		</form>
	{:else}
		<div class="grid min-h-80 place-items-center p-8 text-center">
			<div>
				<h1 id="review-heading" class="text-2xl font-bold text-text-950">No {reviewTabs.find((tab) => tab.status === data.selectedStatus)?.label.toLowerCase()} items</h1>
				<p class="mt-2 text-text-700">There are no item requests in this queue.</p>
			</div>
		</div>
	{/if}
</section>
