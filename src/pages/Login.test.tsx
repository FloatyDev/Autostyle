import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Login } from './Login';
import { CustomerAuthProvider } from '../context/CustomerAuthContext';

// Mock structured fetch response
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Customer Login Component', () => {
    beforeEach(() => {
        mockFetch.mockClear();
        localStorage.clear();
    });

    const renderLogin = () => {
        return render(
            <MemoryRouter>
                <CustomerAuthProvider>
                    <Login />
                </CustomerAuthProvider>
            </MemoryRouter>
        );
    };

    it('renders the login form', () => {
        renderLogin();
        expect(screen.getByRole('heading', { name: /Welcome back/i })).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Email address/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    });

    it('displays error message on failed login', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'Invalid credentials' }),
        });

        renderLogin();

        fireEvent.change(screen.getByPlaceholderText(/Email address/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'wrongpass' } });
        fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });
    });

    it('stores token and navigates on successful login', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                status: 'success',
                token: 'mock_jwt_token',
                user: { id: 1, email: 'test@example.com', first_name: 'John', last_name: 'Doe' }
            }),
        });

        renderLogin();

        fireEvent.change(screen.getByPlaceholderText(/Email address/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

        await waitFor(() => {
            expect(localStorage.getItem('customerToken')).toBe('mock_jwt_token');
        });
    });
});
