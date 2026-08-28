<script lang="ts">
    import ItemRules from '$lib/components/ItemRules.svelte';
    import { createUploadThing } from '$lib/utils/uploadthing';

    let addItemVerif = $state(false);
    let imageFile = $state<File>();
    let imageUrl = $state('');
    let imageKey = $state('');
    let imageProof = $state('');
    let uploadError = $state('');
    let uploadProgress = $state(0);
    let submitUploadedForm = false;
    let { onClose, errorMessage = '' }: { onClose: () => void; errorMessage?: string } = $props();

    const { startUpload, isUploading } = createUploadThing('imageUploader', {
        uploadProgressGranularity: 'fine',
        onUploadProgress: (progress) => {
            uploadProgress = progress;
        },
        onUploadError: (error) => {
            uploadError = error.message;
        }
    });

    async function handleSubmit(event: SubmitEvent) {
        if (submitUploadedForm) {
            submitUploadedForm = false;
            return;
        }

        event.preventDefault();
        const form = event.currentTarget as HTMLFormElement;
        const submitter = event.submitter;

        if (!imageFile) {
            uploadError = 'Choose a product image before submitting.';
            return;
        }

        uploadError = '';
        uploadProgress = 0;

        try {
            const result = await startUpload([imageFile]);
            const uploadedImage = result?.[0];

            if (!uploadedImage?.serverData.ufsUrl) {
                if (!uploadError) uploadError = 'The image could not be uploaded. Please try again.';
                return;
            }

            imageUrl = uploadedImage.serverData.ufsUrl;
            imageKey = uploadedImage.serverData.key;
            imageProof = uploadedImage.serverData.proof;
            submitUploadedForm = true;
            form.requestSubmit(submitter);
        } catch {
            uploadError = 'The image upload was cancelled or interrupted. Please try again.';
        }
    }
</script>


<div class="flex flex-col gap-4 items-center justify-center">
    <h2 class="text-2xl font-semibold">
        Request Item
    </h2>
    {#if addItemVerif === false}
        <ItemRules />
        <button type="button" class="cursor-pointer rounded-sm bg-primary-500 px-4 py-2 text-white mr-4 mb-3" onclick={() => (addItemVerif = true)}>I have read and understood the rules</button>
    {:else}
        <form method="POST" action="?/requestItem" onsubmit={handleSubmit} class="flex flex-col gap-4">
            {#if errorMessage}
                <p class="rounded-md border border-accent-500 bg-accent-500/10 p-3 text-sm text-text-950" role="alert">{errorMessage}</p>
            {/if}

            {#if uploadError}
                <p class="rounded-md border border-accent-500 bg-accent-500/10 p-3 text-sm text-text-950" role="alert">{uploadError}</p>
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
            <input
                type="file"
                id="image-file"
                accept="image/*"
                required
                onchange={(event) => {
                    imageFile = event.currentTarget.files?.[0];
                    imageUrl = '';
                    imageKey = '';
                    imageProof = '';
                    uploadError = '';
                }}
                class="rounded-md border border-background-300 bg-background-50 px-3 py-2 text-sm text-text-950 file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-primary-500 file:px-3 file:py-2 file:text-white"
            >
            <input type="hidden" name="imageUrl" value={imageUrl}>
            <input type="hidden" name="imageKey" value={imageKey}>
            <input type="hidden" name="imageProof" value={imageProof}>
            <p class="-mt-3 text-xs text-text-600">One image, maximum 4 MB. It will upload when you submit the request.</p>
    
            <div class="flex gap-3">
                <button disabled={$isUploading} class="cursor-pointer rounded-sm bg-primary-500 px-4 py-2 text-white disabled:cursor-wait disabled:opacity-60">
                    {$isUploading ? `Uploading ${uploadProgress}%` : 'Submit For Review'}
                </button>
                <button type="button" disabled={$isUploading} class="cursor-pointer rounded-sm border border-background-400 px-4 py-2 text-text-900 disabled:cursor-not-allowed disabled:opacity-60" onclick={onClose}>Cancel</button>
            </div>
        </form>
    {/if}        
</div>
