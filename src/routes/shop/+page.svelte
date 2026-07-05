<script>
    import Modal from '../../modal.svelte';
    let showModal = $state(false);

    // replace wth db @pkd2210
    const shop = {
    "items" : [
        {
            item: 'Asus Zenbook Duo',
            price: 1200,
            goal: 'a year',
            approved: false
        },
        {
            item: 'Iphone 18 Pro Max Ultra Limited Special Shiny Edition',
            price: 123123123123,
            goal: 'a milenium',
            approved: false
        }
    ]
    }

    console.log("name : ", shop.items[0].item);
    console.log("price(USD) : ",shop.items[0].price);
    console.log("Goal : ",shop.items[0].goal);
    console.log("Approved : ",shop.items[0].approved);
</script>

<h1> Shop </h1>

<button onclick={() => (showModal = true)}>Add Item</button>
<hr>

{#each shop.items as item}
    <h2><b>{item.item}</b></h2>
    <h3>{item.price}</h3>
    <h3>{item.goal}</h3>
    <h3>price in hours - {item.price / 5}</h3>
    <h3>goal - {item.goal}</h3>
    {#if item.approved}
    <button>Purchase</button>
    {:else}
    <button disabled>Not Approved Yet</button>
    {/if}
    <br><br>
{/each}

<Modal bind:showModal>
	{#snippet header()}
		<h2>
			Add Item to Shop
		</h2>
	{/snippet}
    <form>
        <label for="item">Item Name</label>
        <input type="text" name="item" id="item" placeholder="Item Name">
        <br><br>
        <label for="price">Price (USD)</label>
        <input type="number" name="price" id="price" placeholder="Price">
        <br><br>
        <label for="goal">Goal (days)</label>
        <input type="number" name="goal" id="goal" placeholder="Goal">
    <button>submit for review</button>
    </form>
</Modal>