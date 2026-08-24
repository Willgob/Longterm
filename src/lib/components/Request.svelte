<script>
    import ItemRules from '$lib/components/ItemRules.svelte'
    let addItemVerif = $state(false);
    let { onClose } = $props();
</script>


<div class="flex flex-col gap-4 items-center justify-center">
    <h2 class="text-2xl font-semibold">
        Request Item
    </h2>
    {#if addItemVerif === false}
        <ItemRules />
        <button type="button" class="cursor-pointer rounded-sm bg-primary-500 px-4 py-2 text-white mr-4 mb-3" onclick={() => (addItemVerif = true)}>I have read and understood the rules</button>
    {:else}
        <form class="flex flex-col gap-4" onsubmit={(e) => { e.preventDefault(); onClose(); }}>
            <label for="item" class="text-sm text-text-700">Product Name</label>
            <input type="text" name="item" id="item" placeholder="Asus Zenbook Duo" class="rounded-md border border-background-30 bg-background-50 px-3 py-2 text-text-950 text-sm" required>
            
            <label for="price" class="text-sm text-text-700">Price (Min $100 USD)</label>
            <input type="number" name="price" id="price" min="100" placeholder="3000" class="rounded-md border border-background-30 bg-background-50 px-3 py-2 text-text-950 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" required>
            
            <label for="goal" class="text-sm text-text-700">Goal (days)</label>
            <input type="number" name="goal" id="goal" placeholder="Goal" class="rounded-md border border-background-30 bg-background-50 px-3 py-2 text-text-950 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" required>

            <label for="description" class="text-sm text-text-700">Description</label>
            <textarea name="description" id="description" placeholder="A Very Cool Computer" class="rounded-md border border-background-30 bg-background-50 px-3 py-2 text-text-950 text-sm" ></textarea>


            <label for="spec" class="text-sm text-text-700">Spec/Config (Optional)</label>
            <textarea name="spec" id="spec" placeholder="Black, Maxed out" class="rounded-md border border-background-30 bg-background-50 px-3 py-2 text-text-950 text-sm" ></textarea>

            <label for="image" class="text-sm text-text-700">Image TO BE REPLACED</label>
            <input type="link" name="image" id="image" placeholder="cdn.hackclub.com/..." class="rounded-md border border-background-30 bg-background-50 px-3 py-2 text-text-950 text-sm" required>
    
            <button class="cursor-pointer rounded-sm bg-primary-500 px-4 py-2 text-white mr-4">Submit For Review</button>
        </form>
    {/if}        
</div>