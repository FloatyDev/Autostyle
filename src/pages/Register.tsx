import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext';

export const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useCustomerAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/customer/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, first_name: firstName, last_name: lastName })
            });

            const data = await response.json();

            if (response.ok && data.status === 'success') {
                login(data.token, data.user);
                navigate('/shop'); // Redirect to shop after successful registration
            } else {
                setError(data.error || 'Registration failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Dark/red theme matching homepage */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-accent/20 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-primary/20 blur-3xl pointer-events-none"></div>

            <div className="max-w-md w-full space-y-8 bg-slate-800/80 backdrop-blur-sm p-10 rounded-2xl shadow-2xl border border-slate-700 relative z-10">
                <div>
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-white">
                        Create an Account
                    </h2>
                    <p className="mt-2 text-center text-sm text-slate-400">
                        Join Autostyle to save your vehicles and check out faster.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-900/50 border-l-4 border-red-500 p-4 rounded-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <span className="material-symbols-outlined text-red-500">error</span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-200">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">First Name</label>
                                <input
                                    name="first_name"
                                    type="text"
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="appearance-none relative block w-full px-4 py-3 bg-slate-900 border border-slate-700 placeholder-slate-500 text-white rounded-lg focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm transition-colors"
                                    placeholder="John"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Last Name</label>
                                <input
                                    name="last_name"
                                    type="text"
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="appearance-none relative block w-full px-4 py-3 bg-slate-900 border border-slate-700 placeholder-slate-500 text-white rounded-lg focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm transition-colors"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Email address</label>
                            <input
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 bg-slate-900 border border-slate-700 placeholder-slate-500 text-white rounded-lg focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm transition-colors"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 bg-slate-900 border border-slate-700 placeholder-slate-500 text-white rounded-lg focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm transition-colors"
                                placeholder="Minimum 6 characters"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white ${isLoading ? 'bg-slate-600 cursor-not-allowed' : 'bg-accent hover:bg-accent/90'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent focus:ring-offset-slate-900 transition-colors shadow-lg shadow-accent/20`}
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-6">
                    <p className="text-sm text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-accent hover:text-white transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
