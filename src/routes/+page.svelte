<script>
    import { supabase } from '$lib/supabaseClient';
    import { goto } from '$app/navigation';
    import Modal from '$lib/Modal.svelte';

    let email = '';
    let password = '';
    let showModal = false;
    let errorMessage = '';

    const signIn = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            console.log('Sign-In Error:', error.message);
            errorMessage = error.message;
            showModal = true;
        } else {
            console.log('Signed In User:', data.user);
            goto('/dashboard'); // Redirect to dashboard after sign-in
        }
    };

    const signUp = async () => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
            console.log('Sign-Up Error:', error.message);
            errorMessage = error.message;
            showModal = true;
        } else {
            console.log('Signed Up User:', data.user);
            goto('/dashboard'); // Redirect to dashboard after sign-up
        }
    };

    const closeModal = () => {
        showModal = false;
    };
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8">
        <div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Sign in or Sign up
            </h2>
        </div>
        <div class="mt-8 space-y-6">
            <div class="rounded-md shadow-sm -space-y-px">
                <div>
                    <label for="email-address" class="sr-only">Email address</label>
                    <input id="email-address" name="email" type="email" autocomplete="email" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address" bind:value={email} />
                </div>
                <div>
                    <label for="password" class="sr-only">Password</label>
                    <input id="password" name="password" type="password" autocomplete="current-password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password" bind:value={password} />
                </div>
            </div>

            <div class="flex justify-between space-x-4">
                <button type="button" on:click={signIn} class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Sign In
                </button>

                <button type="button" on:click={signUp} class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Sign Up
                </button>
            </div>
        </div>
    </div>
</div>

<Modal show={showModal} message={errorMessage} close={closeModal} />