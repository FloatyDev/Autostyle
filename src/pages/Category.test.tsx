import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Category } from './Category';
import { AppProvider } from '../context/AppContext';

// Mock fetch
global.fetch = vi.fn() as unknown as typeof fetch;

describe('Category Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders category tree recursively', async () => {
        // Mock API response for categories
        const mockCategories = {
            status: 'success',
            data: [
                { id: 'cat-1', name: 'Brakes', parent_id: null },
                { id: 'cat-2', name: 'Brake Pads', parent_id: 'cat-1' },
                { id: 'cat-3', name: 'Engine', parent_id: null },
            ]
        };

        const mockProducts = {
            status: 'success',
            data: [],
            count: 0
        };

        (global.fetch as any).mockImplementation((url: string) => {
            if (url.includes('/api/categories')) {
                return Promise.resolve({
                    json: () => Promise.resolve(mockCategories)
                });
            }
            if (url.includes('/api/products')) {
                return Promise.resolve({
                    json: () => Promise.resolve(mockProducts)
                });
            }
            return Promise.resolve(new Response());
        });

        // Use MemoryRouter with search param to test if breadcrumb gets active category
        render(
            <AppProvider>
                <MemoryRouter initialEntries={['/shop?c=cat-2']}>
                    <Category />
                </MemoryRouter>
            </AppProvider>
        );

        // Wait for fetch to complete and UI to update
        await waitFor(() => {
            expect(screen.getByText('Brakes')).toBeInTheDocument();
        });

        // The exact category requested in URL (cat-2 -> Brake Pads) should be rendered in the header or breadcrumbs
        // Since we mock the API, it should find 'Brake Pads'
        expect(screen.getAllByText('Brake Pads').length).toBeGreaterThan(0);

        // Also Engine should be in the sidebar tree
        expect(screen.getByText('Engine')).toBeInTheDocument();
    });
});
