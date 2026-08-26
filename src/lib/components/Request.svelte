<script>
    import ItemRules from '$lib/components/ItemRules.svelte'
    let addItemVerif = $state(false);
    let { onClose, errorMessage = '' } = $props();
</script>


<div class="flex flex-col gap-4 items-center justify-center">
    <h2 class="text-2xl font-semibold">
        Request Item
    </h2>
    {#if addItemVerif === false}
        <ItemRules />
        <button type="button" class="cursor-pointer rounded-sm bg-primary-500 px-4 py-2 text-white mr-4 mb-3" onclick={() => (addItemVerif = true)}>I have read and understood the rules</button>
    {:else}
        <form method="POST" action="?/requestItem" enctype="multipart/form-data" class="flex flex-col gap-4">
            {#if errorMessage}
                <p class="rounded-md border border-accent-500 bg-accent-500/10 p-3 text-sm text-text-950" role="alert">{errorMessage}</p>
            {/if}

            <label for="name" class="text-sm text-text-700">Product Name</label>
            <input type="text" name="name" id="name" minlength="2" maxlength="120" placeholder="Asus Zenbook Duo" class="rounded-md border border-background-300 bg-background-50 px-3 py-2 text-text-950 text-sm" required>
            
            <label for="price" class="text-sm text-text-700">Price (Min $100 USD)</label>
            <input type="number" name="requestedPrice" id="price" min="100" max="10000000" step="1" placeholder="3000" class="rounded-md border border-background-300 bg-background-50 px-3 py-2 text-text-950 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" required>
            
            <label for="goal" class="text-sm text-text-700">Goal (days)</label>
            <input type="number" name="goalDays" id="goal" min="1" max="3650" step="1" placeholder="Goal" class="rounded-md border border-background-300 bg-background-50 px-3 py-2 text-text-950 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" required>

            <label for="description" class="text-sm text-text-700">Description</label>
            <textarea name="description" id="description" minlength="3" maxlength="2000" placeholder="A very cool computer" class="rounded-md border border-background-300 bg-background-50 px-3 py-2 text-text-950 text-sm" required></textarea>


            <label for="spec" class="text-sm text-text-700">Spec/Config (Optional)</label>
            <textarea name="specification" id="spec" maxlength="1000" placeholder="Black, maxed out" class="rounded-md border border-background-300 bg-background-50 px-3 py-2 text-text-950 text-sm"></textarea>

            <label for="image-file" class="text-sm text-text-700">Product image</label>
            <input type="file" name="imageFile" id="image-file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" class="rounded-md border border-background-300 bg-background-50 px-3 py-2 text-sm text-text-950 file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-primary-500 file:px-3 file:py-2 file:text-white">
            <p class="-mt-3 text-xs text-text-600">JPEG, PNG, WebP, GIF, or AVIF. Maximum 5 MB.</p>

            <label for="image-url" class="text-sm text-text-700">Or use an image URL</label>
            <input type="url" name="imageUrl" id="image-url" maxlength="2048" placeholder="https://cdn.hackclub.com/..." class="rounded-md border border-background-300 bg-background-50 px-3 py-2 text-text-950 text-sm">
    
            <div class="flex gap-3">
                <button class="cursor-pointer rounded-sm bg-primary-500 px-4 py-2 text-white">Submit For Review</button>
                <button type="button" class="cursor-pointer rounded-sm border border-background-400 px-4 py-2 text-text-900" onclick={onClose}>Cancel</button>
            </div>
        </form>
    {/if}        
</div>
