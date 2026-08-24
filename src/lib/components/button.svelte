<script>
    /**
     * @type {{
     *   text?: string,
     *   onclick: () => void,
     *   children?: import('svelte').Snippet
     * }}
     */
    let { text, onclick, children } = $props();
</script>

<style>
.on-hover {
    transition: transform 0.2s ease;
    display: inline-block;
}

.on-hover:hover {
    transform: scale(1.1);
}
</style>

<button
    class="on-hover"
    style="background: none; border: none; cursor: pointer; padding: 0;"
    onclick={onclick}
>
    {#if children}
        {@render children()}
    {:else}
        <span>{text}</span>
    {/if}
</button>