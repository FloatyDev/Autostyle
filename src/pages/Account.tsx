import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomerAuth, User } from '../context/CustomerAuthContext';

export const Account: React.FC = () => {
    const { user, addresses, isAuthenticated, fetchProfile } = useCustomerAuth();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Assuming we only handle one default shipping address for now
    const defaultAddress = addresses?.find(a => a.type === 'shipping') || {
        street: '', city: '', postal_code: '', country: 'Greece'
    };

    const [formData, setFormData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        phone: user?.phone || '',
        street: defaultAddress.street,
        city: defaultAddress.city,
        postal_code: defaultAddress.postal_code,
        country: defaultAddress.country,
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name,
                last_name: user.last_name,
                phone: user.phone || '',
                street: defaultAddress.street,
                city: defaultAddress.city,
                postal_code: defaultAddress.postal_code,
                country: defaultAddress.country,
            });
        }
    }, [user, addresses]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const token = localStorage.getItem('customerToken');
            const response = await fetch('/api/customer/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    phone: formData.phone,
                    type: 'shipping',
                    street: formData.street,
                    city: formData.city,
                    postal_code: formData.postal_code,
                    country: formData.country,
                })
            });

            const data = await response.json();

            if (response.ok && data.status === 'success') {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                setIsEditing(false);
                await fetchProfile(); // refresh context user
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to update profile.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An unexpected error occurred.' });
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-black text-slate-900 mb-8 uppercase italic tracking-tight">My Account</h1>

            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <span className="material-symbols-outlined text-accent">manage_accounts</span>
                        Account Details
                    </h2>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-sm font-bold text-accent hover:text-accent/80 transition-colors"
                        >
                            Edit
                        </button>
                    )}
                </div>

                <div className="p-6">
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-lg flex gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-500' : 'bg-red-50 text-red-800 border-l-4 border-red-500'}`}>
                            <span className="material-symbols-outlined">{message.type === 'success' ? 'check_circle' : 'error'}</span>
                            <p className="text-sm font-medium">{message.text}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Personal Info */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Personal Information</h3>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-accent focus:border-accent disabled:opacity-70 disabled:bg-slate-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-accent focus:border-accent disabled:opacity-70 disabled:bg-slate-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={user.email}
                                        disabled
                                        className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                                        title="Email cannot be changed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number (Optional)</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-accent focus:border-accent disabled:opacity-70 disabled:bg-slate-100"
                                    />
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Default Shipping Address</h3>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Street Address</label>
                                    <input
                                        type="text"
                                        name="street"
                                        value={formData.street}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-accent focus:border-accent disabled:opacity-70 disabled:bg-slate-100"
                                        placeholder="123 Main St"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-accent focus:border-accent disabled:opacity-70 disabled:bg-slate-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Postal Code</label>
                                        <input
                                            type="text"
                                            name="postal_code"
                                            value={formData.postal_code}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-accent focus:border-accent disabled:opacity-70 disabled:bg-slate-100"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-accent focus:border-accent disabled:opacity-70 disabled:bg-slate-100"
                                    >
                                        <option value="Greece">Greece</option>
                                        <option value="Cyprus">Cyprus</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        {isEditing && (
                            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        // Reset form data to original state
                                        setFormData({
                                            first_name: user?.first_name || '',
                                            last_name: user?.last_name || '',
                                            phone: user?.phone || '',
                                            street: defaultAddress.street,
                                            city: defaultAddress.city,
                                            postal_code: defaultAddress.postal_code,
                                            country: defaultAddress.country,
                                        });
                                        setMessage({ type: '', text: '' });
                                    }}
                                    className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`px-6 py-2.5 text-sm font-bold text-white rounded-lg flex items-center gap-2 ${isLoading ? 'bg-slate-400' : 'bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20'} transition-all`}
                                >
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};
