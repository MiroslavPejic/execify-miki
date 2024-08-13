import { supabase } from './supabaseClient';
import axios from 'axios';

// Fetch the authenticated user's details
export async function fetchUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
        console.error('Failed to fetch user.', error);
        return { user: null, error: 'Failed to fetch user.' };
    }
    return { user: data.user, error: null };
}

// Fetch the user's selected cryptocurrencies
/**
 * @param {{ id: any; }} user
 */
export async function fetchUserCryptos(user) {
    if (!user) return { userCryptos: [], error: 'User is not authenticated.' };

    const { data, error } = await supabase
        .from('user_cryptos')
        .select('crypto_id')
        .eq('user_id', user.id);

    if (error) {
        console.error('Failed to fetch user cryptocurrencies.', error);
        return { userCryptos: [], error: 'Failed to fetch user cryptocurrencies.' };
    }

    return { userCryptos: data.map(entry => entry.crypto_id), error: null };
}

// Fetch prices from the CoinGecko API based on user's crypto list
/**
 * @param {any[]} userCryptos
 */
export async function fetchPrices(userCryptos) {
    if (userCryptos.length === 0) return { prices: {}, error: null };

    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
            params: {
                ids: userCryptos.join(','),
                vs_currencies: 'usd',
            },
        });
        return { prices: response.data, error: null };
    } catch (error) {
        console.error('Failed to fetch prices. Please try again later.', error);
        return { prices: {}, error: 'Failed to fetch prices. Please try again later.' };
    }
}

// Add a new cryptocurrency for the user
/**
 * @param {{ id: any; }} user
 * @param {any} newCrypto
 */
export async function addCrypto(user, newCrypto) {
    if (!user) return { error: 'User is not authenticated.' };

    const { error } = await supabase
        .from('user_cryptos')
        .insert([{ user_id: user.id, crypto_id: newCrypto }]);

    if (error) {
        console.error('Error adding crypto:', error);
        return { error: 'Error adding crypto.' };
    }
    return { error: null };
}

// Remove a cryptocurrency for the user
/**
 * @param {{ id: any; }} user
 * @param {any} crypto_id
 */
export async function removeCrypto(user, crypto_id) {
    if (!user) return { error: 'User is not authenticated.' };

    const { error } = await supabase
        .from('user_cryptos')
        .delete()
        .eq('user_id', user.id)
        .eq('crypto_id', crypto_id);

    if (error) {
        console.error('Error removing crypto:', error);
        return { error: 'Error removing crypto.' };
    }
    return { error: null };
}

// Function to assign colors based on the cryptocurrency name
/**
 * @param {any} crypto
 */
export function getColor(crypto) {
    switch (crypto) {
        case 'bitcoin':
            return 'text-yellow-500';
        case 'ethereum':
            return 'text-blue-500';
        case 'litecoin':
            return 'text-gray-500';
        case 'ripple':
            return 'text-indigo-500';
        default:
            return 'text-gray-800';
    }
}