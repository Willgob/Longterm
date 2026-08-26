<script lang="ts">
	let { data, form } = $props();

	function formatTime(timestamp: number | null) {
		return timestamp ? new Date(timestamp * 1000).toLocaleString() : '—';
	}

	function activeBan(user: (typeof data.users)[number]) {
		const now = Math.floor(Date.now() / 1000);
		const banEndsAt = user.strikeUpdatedAt ? user.strikeUpdatedAt + 7 * 24 * 60 * 60 : null;
		if (user.strikes >= 4) return 'Permanent program ban';
		if (user.strikes === 3 && banEndsAt && banEndsAt > now) return `Program ban until ${formatTime(banEndsAt)}`;
		if (user.strikes === 2 && banEndsAt && banEndsAt > now) return `Shop ban until ${formatTime(banEndsAt)}`;
		return 'No active ban';
	}
</script>

<svelte:head><title>Admin · Longterm</title></svelte:head>

<section class="mx-auto max-w-6xl space-y-6">
	<header>
		<p class="text-sm font-bold tracking-wide text-accent-600 uppercase">Admin controls</p>
		<h1 class="mt-1 text-4xl font-extrabold">Users, roles, and strikes</h1>
		<p class="mt-2 text-text-700">Administrators can access every area, change roles, and manage each user’s strike count or bans.</p>
	</header>

	{#if form?.message}<p class="rounded-lg border border-red-400 bg-red-100 p-3 text-red-900" role="alert">{form.message}</p>{/if}

	<form method="POST" action="?/issueStrike" class="grid gap-4 rounded-xl border-2 border-background-300 bg-background-200 p-5 md:grid-cols-[1fr_auto] md:items-end">
		<label class="grid gap-1 text-sm font-semibold">User
			<select name="slackId" required class="rounded border border-background-400 bg-background-100 p-2">
				<option value="">Select a user</option>
				{#each data.users as account}<option value={account.slackId}>{account.displayName || account.slackId} ({account.slackId})</option>{/each}
			</select>
		</label>
		<button class="cursor-pointer rounded bg-red-600 px-4 py-2 font-bold text-white">Issue strike</button>
	</form>

	<div class="overflow-x-auto rounded-xl border-2 border-background-300">
		<table class="min-w-full border-collapse text-left text-sm">
			<thead class="bg-background-300"><tr><th class="p-3">User</th><th class="p-3">Strikes</th><th class="p-3">Ban status</th><th class="p-3">Permission</th><th class="p-3">Actions</th></tr></thead>
			<tbody>
				{#each data.users as account}
					<tr class="border-t border-background-300 align-top">
						<td class="p-3"><strong>{account.displayName || account.slackId}</strong><br /><span class="text-xs text-text-700">{account.slackId}</span></td>
						<td class="p-3">{account.strikes}</td>
						<td class="p-3">{activeBan(account)}</td>
						<td class="p-3">
							<form method="POST" action="?/setPermission" class="flex gap-2"><input type="hidden" name="slackId" value={account.slackId} /><select name="perms" class="rounded border border-background-400 bg-background-100 p-1">{#each data.permissions as permission}<option value={permission} selected={account.perms === permission}>{permission}</option>{/each}</select><button class="cursor-pointer rounded bg-primary-500 px-2 py-1 text-white">Save</button></form>
						</td>
						<td class="p-3"><div class="flex flex-wrap gap-2"><form method="POST" action="?/removeStrike"><input type="hidden" name="slackId" value={account.slackId} /><button class="cursor-pointer rounded border border-background-500 px-2 py-1">Remove one strike</button></form><form method="POST" action="?/overturnBan"><input type="hidden" name="slackId" value={account.slackId} /><input type="hidden" name="scope" value="shop" /><button class="cursor-pointer rounded border border-background-500 px-2 py-1">Lift shop ban</button></form><form method="POST" action="?/overturnBan"><input type="hidden" name="slackId" value={account.slackId} /><input type="hidden" name="scope" value="program" /><button class="cursor-pointer rounded border border-background-500 px-2 py-1">Lift program ban</button></form></div></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

</section>
