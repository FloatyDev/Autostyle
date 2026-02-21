import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';

export const Header: React.FC = () => {
    const { language, setLanguage, cart, setIsCartOpen } = useAppContext();
    const { isAuthenticated, user, logout } = useCustomerAuth();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0);

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'gr' : 'en');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const navLinks = [
        { name: language === 'en' ? 'Shop' : 'Κατάστημα', href: '/shop' },
        { name: language === 'en' ? 'Brands' : 'Μάρκες', href: '#' },
        { name: language === 'en' ? 'Deals' : 'Προσφορές', href: '#' },
        { name: language === 'en' ? 'About' : 'Σχετικά', href: '#' },
        { name: language === 'en' ? 'Contact' : 'Επικοινωνία', href: '#' },
    ];

    return (
        <>
            <header className="sticky top-0 z-50 w-full bg-primary border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Mobile Menu Button  */}
                        <div className="flex items-center md:hidden gap-4">
                            <button
                                className="text-white/80 hover:text-white transition-colors flex items-center"
                                onClick={() => setIsMobileMenuOpen(true)}
                            >
                                <span className="material-symbols-outlined">menu</span>
                            </button>
                        </div>

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2">
                            <div className="bg-accent p-1.5 rounded text-white flex items-center justify-center">
                                <span className="material-symbols-outlined block text-sm">settings_input_component</span>
                            </div>
                            <span className="text-white text-xl font-black tracking-tighter uppercase italic">Autostyle</span>
                        </Link>

                        {/* Main Nav */}
                        <nav className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link key={link.name} to={link.href} className="text-white/80 hover:text-white text-sm font-semibold transition-colors">
                                    {link.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Utility Icons */}
                        <div className="flex items-center gap-4">
                            <button className="hidden sm:flex text-white/80 hover:text-white items-center">
                                <span className="material-symbols-outlined">search</span>
                            </button>
                            <button
                                onClick={toggleLanguage}
                                className="hidden sm:block bg-white/10 text-white px-2 py-1 rounded text-xs font-bold hover:bg-white/20 transition-colors"
                            >
                                {language === 'en' ? 'GR/EN' : 'EN/GR'}
                            </button>

                            {/* Desktop Profile Area */}
                            <div className="relative hidden sm:block" ref={dropdownRef}>
                                {isAuthenticated ? (
                                    <button
                                        className="text-white/80 hover:text-white flex items-center gap-1 group"
                                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold shadow-md group-hover:bg-accent/80 transition-colors">
                                            {user?.first_name.charAt(0)}{user?.last_name.charAt(0)}
                                        </div>
                                    </button>
                                ) : (
                                    <Link to="/login" className="text-white/80 hover:text-white flex items-center transition-colors">
                                        <span className="material-symbols-outlined">person</span>
                                    </Link>
                                )}

                                {/* Dropdown Menu */}
                                {isAuthenticated && isProfileDropdownOpen && (
                                    <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-2xl py-2 border border-slate-100 z-50 transform opacity-100 scale-100 transition-all origin-top-right">
                                        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 rounded-t-xl -mt-2">
                                            <p className="text-sm font-bold text-slate-800 truncate">{user?.first_name} {user?.last_name}</p>
                                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                        </div>
                                        <Link
                                            to="/account"
                                            className="px-4 py-2 text-sm text-slate-700 hover:bg-accent hover:text-white flex items-center gap-2 transition-colors mt-1"
                                            onClick={() => setIsProfileDropdownOpen(false)}
                                        >
                                            <span className="material-symbols-outlined text-lg">manage_accounts</span>
                                            {language === 'en' ? 'My Details' : 'Στοιχεία'}
                                        </Link>
                                        <a
                                            href="#"
                                            className="px-4 py-2 text-sm text-slate-700 hover:bg-accent hover:text-white flex items-center gap-2 transition-colors"
                                            onClick={() => setIsProfileDropdownOpen(false)}
                                        >
                                            <span className="material-symbols-outlined text-lg">history</span>
                                            {language === 'en' ? 'Order History' : 'Ιστορικό'}
                                        </a>
                                        <div className="border-t border-slate-100 my-1"></div>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsProfileDropdownOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 font-medium flex items-center gap-2 transition-colors rounded-b-xl"
                                        >
                                            <span className="material-symbols-outlined text-lg">logout</span>
                                            {language === 'en' ? 'Logout' : 'Αποσύνδεση'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <button
                                className="text-white/80 hover:text-white flex items-center relative"
                                onClick={() => setIsCartOpen(true)}
                            >
                                <span className="material-symbols-outlined">shopping_cart</span>
                                <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                                    {cartItemsCount}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Drawer Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* Mobile Drawer */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary border-r border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <Link to="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="bg-accent p-1.5 rounded text-white flex items-center justify-center">
                            <span className="material-symbols-outlined block text-sm">settings_input_component</span>
                        </div>
                        <span className="text-white text-xl font-black tracking-tighter uppercase italic">Autostyle</span>
                    </Link>
                    <button className="text-white/80 hover:text-white flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {isAuthenticated && (
                    <div className="p-4 bg-white/5 border-b border-white/10 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center text-base font-bold shadow-md">
                            {user?.first_name.charAt(0)}{user?.last_name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-white text-sm font-bold">{user?.first_name} {user?.last_name}</p>
                            <p className="text-white/60 text-xs">{user?.email}</p>
                        </div>
                    </div>
                )}

                <div className="p-4 flex-1 overflow-y-auto">
                    <ul className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <Link to={link.href} className="text-white/90 font-semibold text-lg hover:text-accent transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="p-4 border-t border-white/10 flex flex-col gap-4">
                    <button className="flex items-center gap-2 text-white/80 hover:text-white" onClick={toggleLanguage}>
                        <span className="material-symbols-outlined">language</span>
                        {language === 'en' ? 'Switch to GR' : 'Switch to EN'}
                    </button>

                    {isAuthenticated ? (
                        <>
                            <Link to="/account" className="flex items-center gap-2 text-white/80 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                                <span className="material-symbols-outlined">manage_accounts</span>
                                {language === 'en' ? 'My Details' : 'Στοιχεία'}
                            </Link>
                            <button className="flex items-center gap-2 text-white/80 hover:text-white" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>
                                <span className="material-symbols-outlined">logout</span>
                                {language === 'en' ? 'Logout' : 'Αποσύνδεση'}
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="flex items-center gap-2 text-accent font-bold hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                            <span className="material-symbols-outlined">login</span>
                            {language === 'en' ? 'Sign In / Register' : 'Σύνδεση'}
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
};
