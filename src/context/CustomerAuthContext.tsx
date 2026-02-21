import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
}

export interface Address {
    id: number;
    type: string;
    street: string;
    city: string;
    postal_code: string;
    country: string;
    is_default: boolean;
}

interface CustomerAuthContextType {
    user: User | null;
    token: string | null;
    addresses: Address[];
    login: (token: string, user: User) => void;
    logout: () => void;
    fetchProfile: () => Promise<void>;
    isAuthenticated: boolean;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('customerToken'));
    const [addresses, setAddresses] = useState<Address[]>([]);

    useEffect(() => {
        if (token) {
            fetchProfile();
        }
    }, [token]);

    const fetchProfile = async () => {
        if (!token) return;
        try {
            const response = await fetch('/api/customer/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                if (data.status === 'success') {
                    setUser(data.user);
                    setAddresses(data.addresses || []);
                }
            } else {
                if (response.status === 401) {
                    logout();
                }
            }
        } catch (error) {
            console.error("Failed to fetch customer profile:", error);
        }
    };

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem('customerToken', newToken);
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem('customerToken');
        setToken(null);
        setUser(null);
        setAddresses([]);
    };

    return (
        <CustomerAuthContext.Provider value={{
            user,
            token,
            addresses,
            login,
            logout,
            fetchProfile,
            isAuthenticated: !!user
        }}>
            {children}
        </CustomerAuthContext.Provider>
    );
};

export const useCustomerAuth = () => {
    const context = useContext(CustomerAuthContext);
    if (context === undefined) {
        throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
    }
    return context;
};
