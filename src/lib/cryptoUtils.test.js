// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { supabase } from './supabaseClient';
import axios from 'axios';
import {
  fetchUser,
  fetchUserCryptos,
  fetchPrices,
  addCrypto,
  removeCrypto,
  getColor
} from './cryptoUtils';

vi.mock('./supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
  },
}));

vi.mock('axios');

describe('cryptoUtils', () => {

  describe('fetchUser', () => {
    it('should return user data when getUser is successful', async () => {
      const mockUser = { id: '123' };
      supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });

      const result = await fetchUser();
      expect(result.user).toEqual(mockUser);
      expect(result.error).toBeNull();
    });

    it('should return an error when getUser fails', async () => {
      supabase.auth.getUser.mockResolvedValue({ data: null, error: 'Some error' });

      const result = await fetchUser();
      expect(result.user).toBeNull();
      expect(result.error).toBe('Failed to fetch user.');
    });
  });

  describe('fetchUserCryptos', () => {
    it('should return user cryptos when query is successful', async () => {
      const mockUser = { id: '123' };
      const mockData = [{ crypto_id: 'bitcoin' }];
      supabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      });

      const result = await fetchUserCryptos(mockUser);
      expect(result.userCryptos).toEqual(['bitcoin']);
      expect(result.error).toBeNull();
    });

    it('should return an error when user is not authenticated', async () => {
      const result = await fetchUserCryptos(null);
      expect(result.userCryptos).toEqual([]);
      expect(result.error).toBe('User is not authenticated.');
    });

    it('should return an error when query fails', async () => {
      const mockUser = { id: '123' };
      supabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: null, error: 'Query error' }),
      });

      const result = await fetchUserCryptos(mockUser);
      expect(result.userCryptos).toEqual([]);
      expect(result.error).toBe('Failed to fetch user cryptocurrencies.');
    });
  });

  describe('fetchPrices', () => {
    it('should return prices when API call is successful', async () => {
      const mockPrices = { bitcoin: { usd: 50000 } };
      axios.get.mockResolvedValue({ data: mockPrices });

      const result = await fetchPrices(['bitcoin']);
      expect(result.prices).toEqual(mockPrices);
      expect(result.error).toBeNull();
    });

    it('should return an empty object when userCryptos is empty', async () => {
      const result = await fetchPrices([]);
      expect(result.prices).toEqual({});
      expect(result.error).toBeNull();
    });

    it('should return an error when API call fails', async () => {
      axios.get.mockRejectedValue(new Error('API error'));

      const result = await fetchPrices(['bitcoin']);
      expect(result.prices).toEqual({});
      expect(result.error).toBe('Failed to fetch prices. Please try again later.');
    });
  });

  describe('addCrypto', () => {
    it('should add a new crypto when user is authenticated', async () => {
      const mockUser = { id: '123' };
      supabase.from.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ error: null }),
      });

      const result = await addCrypto(mockUser, 'bitcoin');
      expect(result.error).toBeNull();
    });

    it('should return an error when user is not authenticated', async () => {
      const result = await addCrypto(null, 'bitcoin');
      expect(result.error).toBe('User is not authenticated.');
    });

    it('should return an error when insertion fails', async () => {
      const mockUser = { id: '123' };
      supabase.from.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ error: 'Insert error' }),
      });

      const result = await addCrypto(mockUser, 'bitcoin');
      expect(result.error).toBe('Error adding crypto.');
    });
  });

  describe('removeCrypto', () => {
    it('should remove a crypto when user is authenticated', async () => {
      const mockUser = { id: '123' };
      supabase.from.mockReturnValue({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        mockResolvedValue: vi.fn().mockResolvedValue({ error: null }),
      });

      const result = await removeCrypto(mockUser, 'bitcoin');
      expect(result.error).toBeNull();
    });

    it('should return an error when user is not authenticated', async () => {
      const result = await removeCrypto(null, 'bitcoin');
      expect(result.error).toBe('User is not authenticated.');
    });
  });

  describe('getColor', () => {
    it('should return correct color for known cryptos', () => {
      expect(getColor('bitcoin')).toBe('text-yellow-500');
      expect(getColor('ethereum')).toBe('text-blue-500');
      expect(getColor('litecoin')).toBe('text-gray-500');
      expect(getColor('ripple')).toBe('text-indigo-500');
    });

    it('should return default color for unknown cryptos', () => {
      expect(getColor('unknown')).toBe('text-gray-500');
    });
  });
});
