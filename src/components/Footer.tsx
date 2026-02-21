import React from 'react';
import { useAppContext } from '../context/AppContext';

export const Footer: React.FC = () => {
    const { language } = useAppContext();

    return (
        <footer className="bg-primary text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand & Address */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="bg-accent p-1.5 rounded text-white flex items-center justify-center">
                                <span className="material-symbols-outlined block text-sm">settings_input_component</span>
                            </div>
                            <span className="text-xl font-black tracking-tighter uppercase italic">Autostyle</span>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed mb-4">
                            {language === 'en' ? 'Your trusted partner for high-quality automotive spare parts in Crete and beyond.' : 'Ο αξιόπιστος συνεργάτης σας για υψηλής ποιότητας ανταλλακτικά αυτοκινήτων στην Κρήτη και όχι μόνο.'}
                        </p>
                        <div className="flex flex-col gap-2 text-sm text-white/60">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">location_on</span>
                                <span>Ikarou 12, Heraklion, 71307</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">call</span>
                                <span>+30 2810 123 456</span>
                            </div>
                        </div>
                    </div>
                    {/* Links 1 */}
                    <div>
                        <h5 className="font-bold mb-6">{language === 'en' ? 'Quick Links' : 'Γρήγοροι Σύνδεσμοι'}</h5>
                        <ul className="space-y-4 text-sm text-white/60">
                            <li><a className="hover:text-accent transition-colors block" href="/shop">{language === 'en' ? 'Shop All Parts' : 'Αγορά Ανταλλακτικών'}</a></li>
                            <li><a className="hover:text-accent transition-colors block" href="#">{language === 'en' ? 'Latest Deals' : 'Προσφορές'}</a></li>
                            <li><a className="hover:text-accent transition-colors block" href="#">{language === 'en' ? 'Bulk Orders' : 'Μαζικές Παραγγελίες'}</a></li>
                            <li><a className="hover:text-accent transition-colors block" href="#">{language === 'en' ? 'Track Your Order' : 'Εντοπισμός Παραγγελίας'}</a></li>
                        </ul>
                    </div>
                    {/* Links 2 */}
                    <div>
                        <h5 className="font-bold mb-6">{language === 'en' ? 'Company' : 'Εταιρεία'}</h5>
                        <ul className="space-y-4 text-sm text-white/60">
                            <li><a className="hover:text-accent transition-colors block" href="#">{language === 'en' ? 'About Us' : 'Σχετικά με εμάς'}</a></li>
                            <li><a className="hover:text-accent transition-colors block" href="#">{language === 'en' ? 'Contact Support' : 'Επικοινωνία'}</a></li>
                            <li><a className="hover:text-accent transition-colors block" href="#">{language === 'en' ? 'Privacy Policy' : 'Πολιτική Απορρήτου'}</a></li>
                            <li><a className="hover:text-accent transition-colors block" href="#">{language === 'en' ? 'Terms of Service' : 'Όροι Χρήσης'}</a></li>
                        </ul>
                    </div>
                    {/* Newsletter */}
                    <div>
                        <h5 className="font-bold mb-6">{language === 'en' ? 'Stay Updated' : 'Ενημερωθείτε'}</h5>
                        <p className="text-sm text-white/60 mb-4">{language === 'en' ? 'Subscribe for technical tips and exclusive discounts.' : 'Εγγραφείτε για τεχνικές συμβουλές και αποκλειστικές εκπτώσεις.'}</p>
                        <form className="flex gap-2">
                            <input type="email" placeholder={language === 'en' ? "Your email" : "Το email σας"} className="bg-white/5 border-white/10 rounded-lg focus:ring-accent focus:border-accent text-sm w-full" />
                            <button type="submit" className="bg-accent px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center">
                                <span className="material-symbols-outlined text-white">send</span>
                            </button>
                        </form>
                    </div>
                </div>
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-white/40">© 2024 Autostyle Parts & Spares. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-white/40 hover:text-white transition-colors"><span className="material-symbols-outlined text-lg">public</span></a>
                        <a href="#" className="text-white/40 hover:text-white transition-colors"><span className="material-symbols-outlined text-lg">alternate_email</span></a>
                        <a href="#" className="text-white/40 hover:text-white transition-colors"><span className="material-symbols-outlined text-lg">thumb_up</span></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
