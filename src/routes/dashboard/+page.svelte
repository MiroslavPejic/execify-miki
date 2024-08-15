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
  let loading = true; // Add a loading state

  async function loadUserData() {
    loading = true; // Set loading to true while fetching data
    const { user: fetchedUser, error: userError } = await fetchUser();

    if (userError) {
      errorMessage = userError;
      loading = false; // Set loading to false on error
      return;
    }
    
    user = fetchedUser;
    const { userCryptos: fetchedUserCryptos, error: cryptosError } = await fetchUserCryptos(user);

    if (cryptosError) {
      errorMessage = cryptosError;
      loading = false; // Set loading to false on error
      return;
    }

    userCryptos = fetchedUserCryptos;
    const { prices: fetchedPrices, error: pricesError } = await fetchPrices(userCryptos);

    if (pricesError) {
      errorMessage = pricesError;
    } else {
      prices = fetchedPrices;
    }

    loading = false; // Set loading to false after fetching data
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

  const closeModal = () => {
    showModal = false;
  };
</script>

<Navbar />

<div class="flex min-h-screen dark:bg-gray-900 dark:text-gray-200">
  <!-- Left side: List of Cryptos -->
  <div class="w-1/2 p-6 bg-gray-200 dark:bg-gray-600">
    <h2 class="text-xl font-bold mb-4">My Cryptos</h2>
    {#if loading}
      <div class="flex justify-center items-center h-48">
        <div class="spinner"></div>
      </div>
    {:else}
      <ul class="space-y-2">
        {#each Object.entries(prices) as [crypto, value]}
          <div class="bg-white shadow-lg rounded-lg p-6 text-center dark:bg-gray-800 dark:text-gray-300">
            <h2 class="text-2xl font-bold {getColor(crypto)} capitalize mb-4">{crypto}</h2>
            <p class="text-3xl font-semibold text-gray-800 dark:text-gray-100">
              ${value.usd} <span class="text-sm text-gray-600 dark:text-gray-400">USD</span>
            </p>
            <br/>
            <button
              class="p-1 bg-red-500 text-white rounded-md hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
              on:click={() => handleRemoveCrypto(crypto)}
            >
              Remove
            </button>
          </div>
        {/each}
      </ul>
    {/if}
  </div>

  <!-- Right side: Form to Add New Crypto -->
  <div class="w-1/2 p-6 bg-gray-300 dark:bg-gray-700">
    <h2 class="text-xl font-bold mb-4">Add a New Crypto</h2>
    <form on:submit|preventDefault={handleAddCrypto} class="space-y-4">
      <input
        type="text"
        bind:value={newCrypto}
        placeholder="Enter crypto name"
        class="w-full p-2 border rounded-md dark:border-gray-600 dark:bg-gray-600 dark:text-gray-300"
        required
      />
      <button
        type="submit"
        class="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        Add Crypto
      </button>
    </form>
  </div>
</div>

<Modal show={showModal} message={modalMessage} close={closeModal} />
