import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type Language = 'en' | 'gr';

export interface Vehicle {
    make: string;
    model: string;
    year: string;
}

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface AppContextType {
    // i18n
    language: Language;
    setLanguage: (lang: Language) => void;
    // Garage
    vehicle: Vehicle | null;
    setVehicle: (vehicle: Vehicle | null) => void;
    // Cart
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
    cartTotal: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('en');
    const [vehicle, setVehicle] = useState<Vehicle | null>(null);

    // Load cart from localStorage on first render
    const [cart, setCart] = useState<CartItem[]>(() => {
        try {
            const saved = localStorage.getItem('autostyle_cart');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Persist cart to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('autostyle_cart', JSON.stringify(cart));
        } catch {
            // Storage might be full or unavailable — fail silently
        }
    }, [cart]);

    const addToCart = (newItem: CartItem) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === newItem.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === newItem.id ? { ...item, quantity: item.quantity + newItem.quantity } : item
                );
            }
            return [...prev, newItem];
        });
        setIsCartOpen(true); // Open cart when adding item
    };

    const removeFromCart = (itemId: string) => {
        setCart((prev) => prev.filter((item) => item.id !== itemId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const updateQuantity = (itemId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
            return;
        }
        setCart((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity } : item)));
    };

    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <AppContext.Provider
            value={{
                language,
                setLanguage,
                vehicle,
                setVehicle,
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                isCartOpen,
                setIsCartOpen,
                cartTotal,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
