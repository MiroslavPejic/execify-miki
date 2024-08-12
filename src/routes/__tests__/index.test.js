import { render, fireEvent, waitFor } from '@testing-library/svelte';
import { vi } from 'vitest';
import Index from '../+page.svelte';
import { supabase } from '$lib/supabaseClient';

vi.mock('$lib/supabaseClient', () => ({
    supabase: {
        auth: {
            signInWithPassword: vi.fn(),
            signUp: vi.fn(),
        },
    },
}));

describe('Root Index Component (Login Page)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('calls signIn on successful sign in', async () => {
        supabase.auth.signInWithPassword.mockResolvedValue({ data: { user: { id: '123' } } });

        const { getByPlaceholderText, getByText } = render(Index);

        await fireEvent.input(getByPlaceholderText('Email address'), { target: { value: 'test@example.com' } });
        await fireEvent.input(getByPlaceholderText('Password'), { target: { value: 'password' } });

        await fireEvent.click(getByText('Sign In'));

        await waitFor(() => {
            expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
        });
    });

    it('displays an error message on failed sign in', async () => {
        supabase.auth.signInWithPassword.mockResolvedValue({ error: { message: 'Invalid credentials' } });

        const { getByPlaceholderText, getByText, getByRole } = render(Index);

        await fireEvent.input(getByPlaceholderText('Email address'), { target: { value: 'test@example.com' } });
        await fireEvent.input(getByPlaceholderText('Password'), { target: { value: 'password' } });

        await fireEvent.click(getByText('Sign In'));

        await waitFor(() => {
            expect(getByRole('dialog')).toHaveTextContent('Invalid credentials');
        });
    });

    it('calls signUp on successful sign up', async () => {
        supabase.auth.signUp.mockResolvedValue({ data: { user: { id: '123' } } });

        const { getByPlaceholderText, getByText } = render(Index);

        await fireEvent.input(getByPlaceholderText('Email address'), { target: { value: 'newuser@example.com' } });
        await fireEvent.input(getByPlaceholderText('Password'), { target: { value: 'password' } });

        await fireEvent.click(getByText('Sign Up'));

        await waitFor(() => {
            expect(supabase.auth.signUp).toHaveBeenCalledWith({ email: 'newuser@example.com', password: 'password' });
        });
    });

    it('displays an error message on failed sign up', async () => {
        supabase.auth.signUp.mockResolvedValue({ error: { message: 'Email already in use' } });

        const { getByPlaceholderText, getByText, getByRole } = render(Index);

        await fireEvent.input(getByPlaceholderText('Email address'), { target: { value: 'newuser@example.com' } });
        await fireEvent.input(getByPlaceholderText('Password'), { target: { value: 'password' } });

        await fireEvent.click(getByText('Sign Up'));

        await waitFor(() => {
            expect(getByRole('dialog')).toHaveTextContent('Email already in use');
        });
    });
});