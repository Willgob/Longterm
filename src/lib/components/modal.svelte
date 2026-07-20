<script>
	let { showModal = $bindable(), children } = $props();

	let dialog = $state(); // HTMLDialogElement

	$effect(() => {
		if (showModal) dialog.showModal();
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
	onclose={() => (showModal = false)}
  	onclick={(e) => {
        const rect = dialog.getBoundingClientRect();
        const clickedInside =
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom;
        if (!clickedInside) dialog.close();
    }}	
	class="h-157.5 w-100 rounded-xl bg-background-100 p-4 shadow-lg text-text-950 backdrop:blur-xl backdrop:bg-background-200/50 border-2 border-background-950"
>
	<div>
		<!-- {@render header?.()} -->

		{@render children?.()}
		<!-- <hr /> -->
		<!-- svelte-ignore a11y_autofocus -->
		<!-- <button class="cursor-pointer" autofocus onclick={() => dialog.close()}>close modal</button> -->
	</div>
</dialog>

<style>
	dialog {
		position: fixed;
		inset: 0;
		margin: auto;
		max-width: 32em;
		width: min(32em, calc(100vw - 2rem));
	}
	/* dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	} */
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.3s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	/* button {
		display: block;
	} */
</style>
