import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export const Header: React.FC = () => {
    const { language, setLanguage, cart, setIsCartOpen } = useAppContext();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0);

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'gr' : 'en');
    };

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
                        {/* Mobile Menu Button - Added explicitly for mobile responsiveness */}
                        <div className="flex items-center md:hidden gap-4">
                            <button
                                className="text-white/80 hover:text-white transition-colors flex items-center"
                                onClick={() => setIsMobileMenuOpen(true)}
                            >
                                <span className="material-symbols-outlined">menu</span>
                            </button>
                        </div>

                        {/* Logo */}
                        <a href="/" className="flex items-center gap-2">
                            <div className="bg-accent p-1.5 rounded text-white flex items-center justify-center">
                                <span className="material-symbols-outlined block text-sm">settings_input_component</span>
                            </div>
                            <span className="text-white text-xl font-black tracking-tighter uppercase italic">Autostyle</span>
                        </a>

                        {/* Main Nav */}
                        <nav className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <a key={link.name} href={link.href} className="text-white/80 hover:text-white text-sm font-semibold transition-colors">
                                    {link.name}
                                </a>
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
                            <button className="hidden sm:flex text-white/80 hover:text-white items-center">
                                <span className="material-symbols-outlined">person</span>
                            </button>
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
                    <a href="/" className="flex items-center gap-2">
                        <div className="bg-accent p-1.5 rounded text-white flex items-center justify-center">
                            <span className="material-symbols-outlined block text-sm">settings_input_component</span>
                        </div>
                        <span className="text-white text-xl font-black tracking-tighter uppercase italic">Autostyle</span>
                    </a>
                    <button className="text-white/80 hover:text-white flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="p-4 flex-1">
                    <ul className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <a href={link.href} className="text-white/90 font-semibold text-lg hover:text-accent transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                                    {link.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="p-4 border-t border-white/10 flex flex-col gap-4">
                    <button className="flex items-center gap-2 text-white/80 hover:text-white" onClick={toggleLanguage}>
                        <span className="material-symbols-outlined">language</span>
                        {language === 'en' ? 'Switch to Greek (GR)' : 'Αλλαγή σε Αγγλικά (EN)'}
                    </button>
                    <button className="flex items-center gap-2 text-white/80 hover:text-white">
                        <span className="material-symbols-outlined">person</span>
                        {language === 'en' ? 'My Account' : 'Ο Λογαριασμός μου'}
                    </button>
                </div>
            </div>
        </>
    );
};
