<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap" rel="stylesheet" />
</svelte:head>
<div class="flex flex-col min-h-screen">
	{@render children()}
	<!--A footer-->
	<footer class="w-full mt-auto">
		<p style="text-align: center; padding: 1rem; background-color: #f0f0f0; margin: 0;">
			Made With ❤️ By teens from <a href="https://hackclub.com" style="text-decoration: underline;">Hack Club</a> A 503(c)(3) nonprofit organization.
		</p>
	</footer>
</div>