<script>
    import { supabase } from '$lib/supabaseClient'; // Ensure you have the Supabase client imported
    import { goto } from '$app/navigation'; // Import goto for navigation
  
    /**
	 * @type {any[]}
	 */
     export let links = [];
    let showMenu = false;
  
    const handleLogout = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error logging out:', error.message);
        // Handle error (e.g., show a message to the user)
      } else {
        goto('/'); // Redirect to login or home page after logout
      }
    };

  </script>
  
  <nav class="bg-blue-600 text-white dark:bg-gray-800 dark:text-gray-200 p-4 navbar">
    <div class="container mx-auto flex justify-between items-center">
      <div class="text-lg font-bold">
        <a href="/" class="text-white hover:text-gray-300 dark:text-gray-100 dark:hover:text-gray-300">
          Mikis App
        </a>
      </div>
      <div class="hidden md:flex space-x-4">
        {#each links as { href, name }}
          <a 
            href={href} 
            class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-800"
          >
            {name}
          </a>
        {/each}
        <button 
          on:click={handleLogout} 
          class="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-300 dark:bg-red-600 dark:hover:bg-red-800"
        >
          Logout
        </button>
      </div>
      <button class="md:hidden" on:click={() => (showMenu = !showMenu)}>
        &#9776; <!-- Hamburger menu icon -->
      </button>
    </div>
  
    {#if showMenu}
      <div class="md:hidden flex flex-col space-y-2 mt-2">
        {#each links as { href, name }}
          <a 
            href={href} 
            class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-800"
          >
            {name}
          </a>
        {/each}
        <button 
          on:click={handleLogout} 
          class="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-300 dark:bg-red-600 dark:hover:bg-red-800"
        >
          Logout
        </button>
      </div>
    {/if}
  </nav>

  <style>
    .navbar {
      transition: background-color 0.3s, color 0.3s;
    }
    .dark .navbar {
      transition: background-color 0.3s, color 0.3s;
    }
  </style>