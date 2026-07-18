<script>
    import Modal from '../../../modal.svelte';
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
            hoursApproved: 15000000000
        }
    ]
    }

    console.log("name : ", shop.items[0].item);
    console.log("price(USD) : ",shop.items[0].price);
    console.log("Goal : ",shop.items[0].goal);
    console.log("Approved : ",shop.items[0].approved);
</script>

<Button text="Request Item" onclick={() => (showModal = true)} />
<div class="grid grid-cols-[repeat(auto-fill,minmax(225px,225px))] gap-4 justify-center">
    {#each shop.items as item}
        <div class="flex flex-col items-center border-2 border-gray-300 rounded-xl p-4 h-83.75 w-56.25 justify-between">
            <div>
                <!-- Image -->
                <div class="mx-auto flex items-center justify-center border-2 border-dashed rounded-xl aspect-square min-w-40 min-h-40 max-w-40 max-h-40 bg-neutral-500 p-1">
                    <img src="https://cdn.hackclub.com/019f74ff-21f8-7f29-b2a8-916c9afa4d60/testshoop.jpg" alt="" class="block h-full w-full rounded-xl object-cover object-center" />
                </div>
                
                <!-- Item Name -->
                <h2 class="text-xl text-center pt-1">Asus Zenbook Duo</h2>
            </div>

            <div class="flex w-full flex-col gap-2">
                <!--Item hours approved/Price-->
                <div class="flex items-center justify-center gap2">
                    <span>13000/23000</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-clock">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                        <path d="M12 7v5l3 3" />
                    </svg>
                </div>
                
                <!-- Purchase Progress bar -->
                {#if item.approved}

                    <button class="relative h-10 w-full rounded-full overflow-hidden bg-neutral-800">
                        Purchase
                    </button>
                {:else}
                    <button class="relative h-10 w-full rounded-full overflow-hidden bg-neutral-700" disabled>
                        Not Approved Yet
                    </button>
                {/if}
            </div>

        </div>
    {/each}
</div>


<Modal bind:showModal>
	{#snippet header()}
		<h2>
			Add Item
		</h2>
	{/snippet}
    {#if addItemVerif === false}
        <ItemRules />
        <Button onclick={() => (addItemVerif = true)} text="I understand the rules"/>
    {:else}
        <form>
            <label for="item">Item Name</label>
            <input type="text" name="item" id="item" placeholder="Item Name">
            <br><br>
            <label for="price">Price (USD)</label>
            <input type="number" name="price" id="price" placeholder="Price">
            <br><br>
            <label for="goal">Goal (days)</label>
            <input type="number" name="goal" id="goal" placeholder="Goal">
            <button onclick={() => (showModal = false)}>submit for review</button>
        </form>
    {/if}
</Modal>