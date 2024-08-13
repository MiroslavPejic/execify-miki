<script>
    import { fade, scale } from 'svelte/transition';

    export let show = false;
    export let message = '';
    export let close;

    const handleClose = () => {
        close();
    };
</script>

{#if show}
    <div transition:fade class="fixed inset-0 flex items-center justify-center z-50">
        <div transition:fade class="fixed inset-0 bg-gray-900 opacity-50"></div>
        <div 
            role="dialog"
            aria-labelledby="dialog-title"
            aria-describedby="dialog-desc"
            transition:scale={{ duration: 300 }} class="bg-white p-6 rounded-lg shadow-lg z-10 max-w-md w-full"
        >
            <h2 class="text-xl font-bold mb-4">Information</h2>
            <p>{message}</p>
            <button on:click={handleClose} class="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none">
                Close
            </button>
        </div>
    </div>
{/if}