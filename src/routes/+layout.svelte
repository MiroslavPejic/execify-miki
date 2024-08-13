<script>
    import '../app.css';
    import { onMount } from 'svelte';

    onMount(() => {
        const isDarkMode = localStorage.getItem('dark-mode') === 'true';

        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    });
</script>

<slot />