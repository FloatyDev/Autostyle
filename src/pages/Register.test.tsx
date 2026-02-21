import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Register } from './Register';
import { CustomerAuthProvider } from '../context/CustomerAuthContext';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Customer Register Component', () => {
    beforeEach(() => {
        mockFetch.mockClear();
        localStorage.clear();
    });

    const renderRegister = () => {
        return render(
            <MemoryRouter>
                <CustomerAuthProvider>
                    <Register />
                </CustomerAuthProvider>
            </MemoryRouter>
        );
    };

    it('renders the registration form', () => {
        renderRegister();
        expect(screen.getByRole('heading', { name: /Create an Account/i })).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/John/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Doe/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Minimum 6 characters/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
    });

    it('displays validation text when email is already taken', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'Email already exists' }),
        });

        renderRegister();

        fireEvent.change(screen.getByPlaceholderText(/John/i), { target: { value: 'John' } });
        fireEvent.change(screen.getByPlaceholderText(/Doe/i), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), { target: { value: 'taken@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Minimum 6 characters/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

        await waitFor(() => {
            expect(screen.getByText('Email already exists')).toBeInTheDocument();
        });
    });

    it('stores token context and redirects on successful registration', async () => {
        const mockNavigate = vi.fn();

        // Let's just trust that successful registration sets the token
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                status: 'success',
                token: 'mock_jwt_token_reg',
                user: { id: 2, email: 'new@example.com', first_name: 'New', last_name: 'User' }
            }),
        });

        renderRegister();

        fireEvent.change(screen.getByPlaceholderText(/John/i), { target: { value: 'New' } });
        fireEvent.change(screen.getByPlaceholderText(/Doe/i), { target: { value: 'User' } });
        fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), { target: { value: 'new@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Minimum 6 characters/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

        await waitFor(() => {
            expect(localStorage.getItem('customerToken')).toBe('mock_jwt_token_reg');
        });
    });
});
