<script>
    import Navbar from '$lib/Navbar.svelte';
  
    const links = [
      { href: '/dashboard', name: 'Dashboard' },
      { href: '/profile', name: 'Profile' },
      { href: '/settings', name: 'Settings' },
    ];
  </script>
  
  <Navbar {links} />
  
  <main class="p-4 dark:bg-gray-900">
    <div class={`min-h-screen flex justify-center p-6`}>
      <h2 class="text-xl font-bold mb-4">Profile</h2>
    </div>
  </main>
  
  <style>
    main {
      padding-top: 60px; /* Adjust based on navbar height if needed */
    }
  </style>

