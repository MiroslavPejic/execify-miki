<script>
// @ts-nocheck

  import Navbar from '$lib/Navbar.svelte';
  import { onMount } from 'svelte';
  import '../../styles/settings.css'; // Import the CSS file

  let isDarkMode = false;

  // Function to apply the theme based on the isDarkMode variable
  function applyTheme() {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  // Check localStorage and set isDarkMode on mount
  onMount(() => {
    const storedMode = localStorage.getItem('dark-mode');
    isDarkMode = storedMode === 'true';
    applyTheme();
  });

  // Toggle function for dark mode
  /**
	 * @param {{ target: { checked: boolean; }; }} event
	 */
  function toggleDarkMode(event) {
    isDarkMode = event.target.checked; // Update isDarkMode based on checkbox state
    // @ts-ignore
    localStorage.setItem('dark-mode', isDarkMode);
    applyTheme();
  }
</script>

<Navbar />

<div class={`min-h-screen flex items-center justify-center p-6 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
  <div class="max-w-md w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
    <h2 class="text-xl font-bold mb-4">Settings</h2>
    <div class="flex items-center">
      <label for="dark-mode-toggle" class="mr-4">Dark Mode:</label>
      <input
        id="dark-mode-toggle"
        type="checkbox"
        bind:checked={isDarkMode}
        on:change={toggleDarkMode}
        class="toggle-checkbox"
      />
      <span class="ml-2">{isDarkMode ? 'Enabled' : 'Disabled'}</span>
    </div>
  </div>
</div>

