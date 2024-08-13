<script>
  import Navbar from '$lib/Navbar.svelte';
  import { fetchUser } from '$lib/cryptoUtils'; // Import from CryptoUtils
  import { onMount } from 'svelte';

  const links = [
    { href: '/dashboard', name: 'Dashboard' },
    { href: '/profile', name: 'Profile' },
    { href: '/settings', name: 'Settings' },
  ];

  /**
	 * @type {{ user: null; error: string; } | { user: import("@supabase/auth-js").User; error: null; } | null}
	 */
  let user = null; // To store user data
  let isDarkMode = false; // To handle dark mode

  // Function to apply the theme based on the isDarkMode variable
  function applyTheme() {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  // Fetch the user's details
  async function loadUser() {
    try {
      user = await fetchUser();
      console.log('user is: ', user);
    } catch (error) {
      // Handle error if needed
    }
  }

  onMount(async () => {
    const storedMode = localStorage.getItem('dark-mode');
    isDarkMode = storedMode === 'true';
    applyTheme();
    await loadUser();
  });
</script>

<Navbar {links} />

<main class={`min-h-screen flex items-center justify-center p-6 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
  <div class="max-w-lg w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
    <h2 class="text-xl font-bold mb-4">Profile</h2>
    {#if user}
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-semibold">Email</h3>
          <p class="text-gray-700 dark:text-gray-300">{user.user.email}</p>
        </div>
        <!-- Add more user details as needed -->
        <!-- Example: -->
        <!--
        <div>
          <h3 class="text-lg font-semibold">Username</h3>
          <p class="text-gray-700 dark:text-gray-300">{user.username}</p>
        </div>
        -->
      </div>
    {:else}
      <p class="text-gray-700 dark:text-gray-300">Loading user data...</p>
    {/if}
  </div>
</main>