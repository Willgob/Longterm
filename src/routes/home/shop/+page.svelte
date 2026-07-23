<script>
    import Modal from '../../../lib/components/modal.svelte';
    import ItemRules from '$lib/components/ItemRules.svelte'
    import Button from '$lib/components/button.svelte';
    let showModal = $state(false);
    let addItemVerif = $state(false);

    // replace wth db @pkd2210
    const shop = {
    "items" : [
        {
            item: 'Asus Zenbook Duo',
            price: 1200,
            goal: 'a year',
            approved: false,
            hoursApproved: 0
        },
        {
            item: 'Iphone 18 Pro Max Ultra Limited Special Shiny Edition',
            price: 123123123123,
            goal: 'a milenium',
            approved: true,
            hoursApproved: 30
        }
    ]
    }

    console.log("name : ", shop.items[0].item);
    console.log("price(USD) : ",shop.items[0].price);
    console.log("Goal : ",shop.items[0].goal);
    console.log("Approved : ",shop.items[0].approved);
</script>

<!-- <Button text="Request Item" onclick={() => (showModal = true)} /> -->

<!-- progress bar -->
<div class="relative flex flex-col rounded-lg p-4 min-h-4 w-full border-2 border-background-200 mb-4">
    <h2 class="text-2xl">Progress to <span class="font-semibold">Asus Zenbook Duo</span></h2>
    <p class="mb-3 text-sm">You have 2500 Clocks to go!</p>
    <div class=" justify-between flex w-full text-xs text-text-950">
        <p class="text-sm mt-auto mb-0.5 text-text-900">Clocks earned</p>
        <p class="text-sm mt-auto mb-0.5">2500/5000</p>
    </div>
    
    <div class="relative w-full h-2 rounded-full overflow-hidden bg-background-200">
        <div class="absolute left-0 top-0 h-full bg-primary-600 rounded-full rounded-tr-none rounded-br-none" style="width: {(2500/5000) * 100}%"></div>
        <div class="absolute left-0 top-0 h-full bg-primary-600/40 rounded-full rounded-tr-none rounded-br-none" style="width: {(3500/5000) * 100}%"></div>
    </div>
    <div class="mt-2 flex flex-wrap items-center gap-4 text-xs text-text-950">
        <div class="flex items-center gap-2">
            <span class="h-3 w-3 rounded-full bg-primary-600/40"></span>
            <span>Hours Tracked</span>
        </div>
        <div class="flex items-center gap-2">
            <span class="h-3 w-3 rounded-full bg-primary-600"></span>
            <span>Approved hours</span>
        </div>
    </div>
    <button class="cursor-pointer absolute right-4 top-4 rounded-sm bg-primary-500 px-4 py-2 text-white" onclick={() => (showModal = true)}>Switch Goal</button>
</div>

<div class="flex items-center p-4">
    <button class="cursor-pointer rounded-sm bg-primary-500 px-4 py-2 text-white mr-4" onclick={() => (showModal = true)}>Request Item</button>
    <button class="cursor-pointer rounded-sm bg-primary-500 px-4 py-2 text-white" onclick={() => (showModal = true)}>Orders</button>
</div>

<!-- items -->
<div class="grid grid-cols-[repeat(auto-fill,minmax(225px,225px))] gap-4 justify-start p-4">
    {#each shop.items as item}
        <div class="flex flex-col items-center border-2 border-background-300 rounded-xl p-4 h-83.75 w-56.25 justify-between bg-background-200">
            <div>
                <!-- Image -->
                <div class="mx-auto relative flex h-40 w-48 items-center justify-center overflow-hidden rounded-xl border-0 border-dashed border-primary-500 bg-primary-700/15 p-1">
                    <img src="https://cdn.hackclub.com/019f74ff-21f8-7f29-b2a8-916c9afa4d60/testshoop.jpg" alt="" class="block h-full w-full rounded-xl object-contain object-center" />
                </div>
                
                <!-- Item Name -->
                <p class="text-xl text-center pt-1 text-text-800 font-semibold">Asus Zenbook Duo</p>
                <p class="text-xs text-center pt-1 text-text-800">This is MY DREEEAM Laptop</p>
            </div>

            <div class="flex w-full flex-col gap-2">
                
                <!-- Purchase -->
                {#if item.approved}
                    <button class=" cursor-pointer relative h-10 w-full rounded-full overflow-hidden bg-background-400 flex items-center justify-center gap-2">
                        13000/23000
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-clock">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                            <path d="M12 7v5l3 3" />
                        </svg>
                    </button>
                {:else}
                    <button class="relative h-10 w-full rounded-full overflow-hidden bg-background-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" disabled>
                        Not Approved Yet
                    </button>
                {/if}
            </div>

        </div>
    {/each}
</div>


<Modal bind:showModal>
    <div class="flex flex-col gap-4 items-center justify-center">
        <h2 class="text-2xl font-semibold">
            Request Item
        </h2>
        {#if addItemVerif === false}
            <ItemRules />
            <button type="button" class="cursor-pointer rounded-sm bg-primary-500 px-4 py-2 text-white mr-4 mb-3" onclick={() => (addItemVerif = true)}>I have read and understood the rules</button>
        {:else}
            <form class="flex flex-col gap-4">
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
        
                <button class="cursor-pointer rounded-sm bg-primary-500 px-4 py-2 text-white mr-4" onclick={() => (showModal = false)}>Submit For Review</button>
            </form>
        {/if}        
    </div>
</Modal>
