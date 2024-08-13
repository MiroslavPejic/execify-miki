<script>
// @ts-nocheck
import Navbar from '$lib/Navbar.svelte';
import Modal from '$lib/Modal.svelte';
import {
  fetchUser,
  fetchUserCryptos,
  fetchPrices,
  addCrypto,
  removeCrypto,
  getColor
} from '$lib/cryptoUtils';

  let prices = {};
  let errorMessage = '';
  let userCryptos = [];
  let user = null;
  let showModal = false;
  let modalMessage = 'Loading ...';
  let newCrypto = '';

  async function loadUserData() {
    const { user: fetchedUser, error: userError } = await fetchUser();
    if (userError) {
      errorMessage = userError;
      return;
    }
    
    user = fetchedUser;
    const { userCryptos: fetchedUserCryptos, error: cryptosError } = await fetchUserCryptos(user);
    if (cryptosError) {
      errorMessage = cryptosError;
      return;
    }

    userCryptos = fetchedUserCryptos;
    const { prices: fetchedPrices, error: pricesError } = await fetchPrices(userCryptos);
    if (pricesError) {
      errorMessage = pricesError;
    } else {
      prices = fetchedPrices;
    }
  }

  async function handleAddCrypto() {
    showModal = true;

    const { error } = await addCrypto(user, newCrypto);
    if (error) {
      errorMessage = error;
    } else {
      await loadUserData();
    }
    showModal = false;
  }

  async function handleRemoveCrypto(crypto_id) {
    showModal = true;
    const { error } = await removeCrypto(user, crypto_id);
    if (error) {
      errorMessage = error;
    } else {
      await loadUserData();
    }
    showModal = false;
  }

  loadUserData();

  const links = [
    { href: '/dashboard', name: 'Dashboard' },
    { href: '/profile', name: 'Profile' },
    { href: '/settings', name: 'Settings' },
  ];

  const closeModal = () => {
    showModal = false;
  };
</script>
  
<Navbar {links} />

<div class="flex min-h-screen">
    <!-- Left side: List of Cryptos -->
    <div class="w-1/2 p-6 bg-gray-100">
      <h2 class="text-xl font-bold mb-4">My Cryptos</h2>
      <ul class="space-y-2">
        {#each Object.entries(prices) as [crypto, value]}
          <div class="bg-white shadow-lg rounded-lg p-6 text-center">
            <h2 class="text-2xl font-bold {getColor(crypto)} capitalize mb-4">{crypto}</h2>
              <p class="text-3xl font-semibold text-gray-800">${value.usd} <span class="text-sm text-gray-600">USD</span></p>
              <br/>
              <button
            class="p-1 bg-red-500 text-white rounded-md hover:bg-red-600"
            on:click={() => handleRemoveCrypto(crypto)}
          >
            Remove
          </button>
          </div>
        {/each}
      </ul>
    </div>
  
    <!-- Right side: Form to Add New Crypto -->
    <div class="w-1/2 p-6 bg-gray-200">
      <h2 class="text-xl font-bold mb-4">Add a New Crypto</h2>
      <form on:submit|preventDefault={handleAddCrypto} class="space-y-4">
        <input
          type="text"
          bind:value={newCrypto}
          placeholder="Enter crypto name"
          class="w-full p-2 border rounded-md"
          required
        />
        <button
          type="submit"
          class="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Crypto
        </button>
      </form>
    </div>
</div>

<Modal show={showModal} message={modalMessage} close={closeModal} />
