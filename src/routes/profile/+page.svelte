<script>
    import Navbar from '$lib/Navbar.svelte';
  
    const links = [
      { href: '/dashboard', name: 'Dashboard' },
      { href: '/profile', name: 'Profile' },
      { href: '/settings', name: 'Settings' },
    ];
  </script>
  
  <Navbar {links} />
  
  <main class="p-4">
    <div class="min-h-screen flex items-center justify-center">
        <div class="max-w-md w-full space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Profile page
                </h2>
            </div>
            </div>
    </div>
  </main>
  
  <style>
    main {
      padding-top: 60px; /* Adjust based on navbar height if needed */
    }
  </style>

