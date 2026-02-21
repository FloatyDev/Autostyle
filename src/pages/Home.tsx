import React from 'react';
import { VehicleSelector } from '../components/VehicleSelector';
import { useAppContext } from '../context/AppContext';

export const Home: React.FC = () => {
    const { language, addToCart, setIsCartOpen } = useAppContext();

    const featured = [
        { id: 1, name: 'Carbon Ceramic Brake Kit', price: 429.00, brand: 'Brembo', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiuEAPVr1rqDjKc3iGFxU1RFW8_MZs10z8y810lE3PH5IAKKNb_DRrDepkngCPG68zECOQkosABnfglf2jpSn9QUoiBizenDvItQKE1oRmlQrhD_oUvJ-YENP2fCUzI5NCyYN3gHq1SDNGGTgO0kEMThaQpkdABj1ocohnCqeCBuY-z2bV0KLmrL8XJUxVoJOHL2zlCmPd3Dnn69eXoSnpgnnWRxCV-06pG83yFX7VMxCPSLkC2JJUdYu_NkGzFU8HqKNhDMOEtDc', hot: true },
        { id: 2, name: 'Laser Iridium Spark Plug', price: 18.50, brand: 'NGK', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0RVyIpAWUcsQ3opndmfAf7Mds31L5-ut2l-t1og7HlUMn8pG2MD-lPKcPN29w59ae5s5HnZvfje-7LS8meNty7Lx0nV40TY7_ubg52xeqp4X_uZ1VypEnByxIdseCaaiyOKvGQp4Ylk0vjV9VZo-46Nr488iHxexlGGgFg2BH1cW-Zfgp-mkLv8fVb_K7BiPfnoCJNOna8bb-fG-8khHPobaf9MHFvl2ich43wU90CzBCIhHR9nqvKkjUPZghyRsDqgUbm5AgL_s', hot: false },
        { id: 3, name: 'Edge 5W-30 Synthetic (5L)', price: 54.90, brand: 'Castrol', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9FB-nKzqVpvmBgCI0Oo-M_UUwdubERg3QDJlbGaX7S82spL4F1RklyDaqcDj_6A1aY05WyjjZ8R7ES8TVT20s-AzK6SvPFbOQDUmLyrb4_3D6-n-lAfgkhedj2JGv6IacXYN5h96p32Dh0bM815W65DYal8jbIAjsi7MMkC1ihYkiUyG1tHxXXt0WTp1qNMsNG5RdFb50M-zXY7gie4di1hbCosxohGBXxvQ7FIWx_ITBM496QVKOmfJNQ8qEo11TDmBeLrrLags', hot: false },
        { id: 4, name: 'LED Headlight Assembly', price: 185.00, brand: 'Valeo', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCt7w3wkCxWclyt9i4qQPQqoao-ZkHDoV4Sznn3JcsLiZKqIT-2FaDuHBJBVhuffuiUCq6jenS1aqCLz5kQp9N1KHq6u5gn-Z4dfFDfRYgWJR7jfyFgjppVN3h8vDqvEYm-_QiialQ791HKBiSjjnPYl3oEp4ZcDKDGu2FrY0wxMoxzUo0hr_MMja-G_pUf7UV43ihkuq5kMBmcS_d5xtGTp0WONJzU9P9Y6NSQObiEbRrVFPU7lTD6V_Xx-bFyVzbs3mTRWPfO3kI', hot: false },
    ];

    const categories = [
        { label: language === 'en' ? 'Engine' : 'Κινητήρας', icon: 'settings' },
        { label: language === 'en' ? 'Brakes' : 'Φρένα', icon: 'album' },
        { label: language === 'en' ? 'Suspension' : 'Ανάρτηση', icon: 'tire_repair' },
        { label: language === 'en' ? 'Electrical' : 'Ηλεκτρικά', icon: 'bolt' },
        { label: language === 'en' ? 'Body & Exterior' : 'Αμάξωμα', icon: 'directions_car' },
        { label: language === 'en' ? 'Filters & Fluids' : 'Φίλτρα & Υγρά', icon: 'opacity' },
    ];

    return (
        <main>
            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDeDIZ_MCyXa3lIFvcSLdYGBuvcZlf6iq6wb2QQ_cUhdArkCZx0TLUgflXNni4H2lPxHmL1arFgZuKFKc0_8iKECXMG_TneEniSXnnQkE-lkFS7gzDF2It7msE0wOJLtJudDN9RfVRDAD3V08fdr7Kk2pqadZoXU-0d0FqXXioU2ea-R4VWjqJ2nktZQCHXUU4AUhriHm2cgA3_5XW_UqqkIwig3ly_BfX3Gs0y5pKpEr7eyp3MkkbBlXLyVvDx-SDEkpAKXSym41w')" }}></div>
                <div className="absolute inset-0 bg-hero-overlay"></div>
                <div className="relative z-10 max-w-5xl w-full px-4 text-center mt-8">
                    <h1 className="text-white text-5xl md:text-6xl font-black tracking-tight mb-4">
                        {language === 'en' ? 'Precision parts. Simple.' : 'Κορυφαία Ανταλλακτικά. Απόλυτη Εφαρμογή.'}
                    </h1>
                    <p className="text-white/70 text-lg md:text-xl mb-12">
                        {language === 'en' ? 'The right part, right away. Guaranteed compatibility.' : 'Βρείτε ακριβώς το κατάλληλο ανταλλακτικό για το όχημά σας σε δευτερόλεπτα.'}
                    </p>

                    {/* Vehicle Selector Widget */}
                    <VehicleSelector />
                </div>
            </section>

            {/* Trust Bar */}
            <section className="bg-white border-b border-slate-200 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex items-center justify-center md:justify-start gap-4">
                            <span className="material-symbols-outlined text-accent text-3xl">local_shipping</span>
                            <div>
                                <h4 className="font-bold text-slate-900 leading-tight">{language === 'en' ? 'Fast Delivery' : 'Γρήγορη Παράδοση'}</h4>
                                <p className="text-sm text-slate-500">{language === 'en' ? 'Same-day shipping across Greece' : 'Αποστολή αυθημερόν σε όλη την Ελλάδα'}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center md:justify-end gap-4 border-t md:border-t-0 md:border-l border-slate-100 py-6 md:py-0">
                            <span className="material-symbols-outlined text-accent text-3xl">location_on</span>
                            <div>
                                <h4 className="font-bold text-slate-900 leading-tight">{language === 'en' ? 'Store in Heraklion' : 'Κατάστημα στο Ηράκλειο'}</h4>
                                <p className="text-sm text-slate-500">{language === 'en' ? 'Visit us for expert advice' : 'Επισκεφθείτε μας για εξειδικευμένες συμβουλές'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Grid */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-primary tracking-tight">{language === 'en' ? 'Shop by Category' : 'Αγορές ανά Κατηγορία'}</h2>
                        <div className="h-1.5 w-12 bg-accent mt-2"></div>
                    </div>
                    <a className="text-accent font-bold text-sm flex items-center gap-1 hover:underline" href="/shop">
                        {language === 'en' ? 'View All Categories' : 'Δείτε όλες τις Κατηγορίες'} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </a>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((cat, idx) => (
                        <a key={idx} className="group bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-accent/20 transition-all text-center flex flex-col items-center" href="/shop">
                            <span className="material-symbols-outlined text-4xl text-slate-400 group-hover:text-accent transition-colors mb-3">{cat.icon}</span>
                            <p className="font-bold text-sm text-slate-700">{cat.label}</p>
                        </a>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-16 bg-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-black text-primary tracking-tight mb-8 text-center">{language === 'en' ? 'Featured Products' : 'Προτεινόμενα Προϊόντα'}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featured.map(prod => (
                            <div key={prod.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group">
                                <div className="h-48 bg-white relative p-4 flex items-center justify-center">
                                    <img className="h-full object-contain" src={prod.image} alt={prod.name} />
                                    {prod.hot && <span className="absolute top-2 right-2 bg-accent text-white text-[10px] font-black px-2 py-1 rounded">HOT DEAL</span>}
                                </div>
                                <div className="p-5">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{prod.brand}</p>
                                    <h3 className="font-bold text-slate-900 mb-2 truncate">{prod.name}</h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-black text-primary">€{prod.price.toFixed(2)}</span>
                                        <button
                                            className="bg-primary text-white p-2.5 rounded-full hover:bg-accent hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                                            onClick={() => {
                                                addToCart({
                                                    id: String(prod.id),
                                                    name: prod.name,
                                                    price: prod.price,
                                                    quantity: 1,
                                                    image: prod.image,
                                                });
                                                setIsCartOpen(true);
                                            }}
                                            aria-label={`Add ${prod.name} to cart`}
                                        >
                                            <span className="material-symbols-outlined text-xl block" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Brands */}
            <section className="py-12 border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">
                        {language === 'en' ? 'Authorised Distributor of Trusted Brands' : 'Εξουσιοδοτημένος Διανομέας Αξιόπιστων Εμπορικών Σημάτων'}
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all">
                        <span className="text-2xl font-black italic text-slate-800">BOSCH</span>
                        <span className="text-2xl font-black italic text-slate-800">NGK</span>
                        <span className="text-2xl font-black italic text-slate-800">brembo</span>
                        <span className="text-2xl font-black italic text-slate-800">Castrol</span>
                        <span className="text-2xl font-black italic text-slate-800">Valeo</span>
                        <span className="text-2xl font-black italic text-slate-800">MANN</span>
                    </div>
                </div>
            </section>
        </main>
    );
};
