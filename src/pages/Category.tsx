import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useLocation } from 'react-router-dom';

interface Product {
    id: string;
    name: string;
    price: number;
    original_price: number | null;
    brand: string;
    rating: number;
    part_number: string;
    image: string;
    in_stock: number;
}

export const Category: React.FC = () => {
    const { language, vehicle } = useAppContext();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get('c') || 'all-categories';

    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);

    // Filter states
    const [minPrice, setMinPrice] = useState(20);
    const [maxPrice, setMaxPrice] = useState(350);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [compatibleOnly, setCompatibleOnly] = useState(!!vehicle?.make);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const toggleBrand = (brand: string) => {
        setSelectedBrands(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    const fetchProducts = () => {
        setLoading(true);
        const params = new URLSearchParams();

        if (categoryParam !== 'all-categories') {
            params.append('category', categoryParam);
        }
        if (selectedBrands.length > 0) {
            params.append('brands', selectedBrands.join(','));
        }
        if (minPrice) params.append('min_price', minPrice.toString());
        if (maxPrice) params.append('max_price', maxPrice.toString());

        // Add vehicle params if 'compatibleOnly' is true and a vehicle is selected in context
        if (compatibleOnly && vehicle?.make) {
            params.append('make', vehicle.make);
            if (vehicle.model) params.append('model', vehicle.model);
            if (vehicle.year) params.append('year', vehicle.year);
        }

        fetch(`/api/products?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setProducts(data.data);
                }
            })
            .catch(err => console.error("Error fetching products:", err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchProducts();
    }, [categoryParam, selectedBrands, minPrice, maxPrice, compatibleOnly, vehicle]);

    const toggleMobileFilters = () => setIsMobileFiltersOpen(!isMobileFiltersOpen);

    return (
        <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 bg-background-light text-slate-900 font-display">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6 uppercase tracking-wider">
                <a href="/" className="hover:text-primary">{language === 'en' ? 'Home' : 'Αρχική'}</a>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
                <a href="/shop" className="hover:text-primary">{language === 'en' ? 'Shop' : 'Αγορές'}</a>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
                <span className="text-primary font-bold">{language === 'en' ? 'Brakes' : 'Φρένα'}</span>
            </nav>

            {/* Page Title & Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-primary mb-2">
                        {language === 'en' ? 'Brakes & Brake Parts' : 'Φρένα & Εξαρτήματα Φρένων'}
                    </h1>
                    <p className="text-slate-500 max-w-xl">
                        {language === 'en'
                            ? 'Find premium braking systems, pads, and rotors engineered for maximum safety and performance.'
                            : 'Βρείτε κορυφαία συστήματα πέδησης, τακάκια και δισκόπλακες σχεδιασμένα για μέγιστη ασφάλεια.'}
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-xs font-bold text-slate-400 pl-2">{language === 'en' ? 'SORT BY:' : 'ΤΑΞΙΝΟΜΗΣΗ:'}</span>
                    <select className="border-none bg-transparent text-sm font-bold focus:ring-0 py-1 pr-8 cursor-pointer outline-none custom-select">
                        <option>{language === 'en' ? 'Relevance' : 'Συνάφεια'}</option>
                        <option>{language === 'en' ? 'Price: Low to High' : 'Τιμή: Αύξουσα'}</option>
                        <option>{language === 'en' ? 'Price: High to Low' : 'Τιμή: Φθίνουσα'}</option>
                        <option>{language === 'en' ? 'Newest Arrivals' : 'Νέες Αφίξεις'}</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Mobile Filter Toggle Button */}
                <button
                    className="lg:hidden w-full py-3 bg-white border border-slate-200 rounded-xl font-bold text-primary flex items-center justify-center gap-2"
                    onClick={toggleMobileFilters}
                >
                    <span className="material-symbols-outlined">filter_list</span>
                    {language === 'en' ? 'Filters & Vehicle' : 'Φίλτρα & Όχημα'}
                </button>

                {/* Sidebar (Filters) */}
                <aside className={`w-full lg:w-72 shrink-0 space-y-6 ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
                    {/* My Garage Widget */}
                    <div className="bg-primary text-white rounded-xl p-5 shadow-lg relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 opacity-10">
                            <span className="material-symbols-outlined text-8xl">directions_car</span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                                {language === 'en' ? 'My Garage' : 'Το Γκαράζ Μου'}
                            </p>
                            {vehicle?.make ? (
                                <h3 className="text-lg font-bold mb-3">{`${vehicle.make} ${vehicle.model} ${vehicle.year}`}</h3>
                            ) : (
                                <h3 className="text-lg font-bold mb-3">{language === 'en' ? 'No Vehicle Selected' : 'Δεν επιλέχθηκε όχημα'}</h3>
                            )}
                            <div className="flex gap-2">
                                <button className="bg-white/10 hover:bg-white/20 transition-colors text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">edit</span>
                                    {language === 'en' ? 'Edit' : 'Αλλαγή'}
                                </button>
                                <button className="bg-accent text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">garage</span>
                                    {language === 'en' ? 'View All' : 'Προβολή Όλων'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Filters Container */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        {/* Compatibility Toggle */}
                        <div className="p-5 border-b border-slate-100">
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm font-bold text-primary">
                                    {language === 'en' ? 'Compatible parts only' : 'Μόνο συμβατά'}
                                </span>
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={compatibleOnly} onChange={() => setCompatibleOnly(!compatibleOnly)} />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent hover:peer-checked:bg-red-700"></div>
                                </div>
                            </label>
                        </div>

                        {/* Brand Filter */}
                        <div className="p-5 border-b border-slate-100">
                            <h4 className="text-sm font-black uppercase tracking-wider mb-4">
                                {language === 'en' ? 'Brands' : 'Μάρκες'}
                            </h4>
                            <div className="space-y-3">
                                {[
                                    { name: 'Bosch', count: 124 },
                                    { name: 'Brembo', count: 86 },
                                    { name: 'Valeo', count: 52 },
                                    { name: 'Ferodo', count: 41 },
                                    { name: 'Castrol', count: 19 },
                                ].map((b, i) => (
                                    <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" checked={selectedBrands.includes(b.name)} onChange={() => toggleBrand(b.name)} className="rounded border-slate-300 text-accent focus:ring-accent w-4 h-4 cursor-pointer" />
                                        <span className="text-sm text-slate-600 group-hover:text-primary transition-colors">{b.name}</span>
                                        <span className="ml-auto text-[10px] font-bold text-slate-400">{b.count}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price Filter */}
                        <div className="p-5 border-b border-slate-100">
                            <h4 className="text-sm font-black uppercase tracking-wider mb-4">
                                {language === 'en' ? 'Price Range' : 'Εύρος Τιμής'}
                            </h4>
                            <div className="px-2">
                                <div className="h-1 bg-slate-200 rounded-full relative mb-6">
                                    <div className="absolute h-1 bg-accent left-0 right-1/4 rounded-full"></div>
                                    <div className="absolute size-4 bg-white border-2 border-accent rounded-full -top-1.5 left-0 cursor-pointer shadow-sm"></div>
                                    <div className="absolute size-4 bg-white border-2 border-accent rounded-full -top-1.5 right-1/4 cursor-pointer shadow-sm"></div>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <span className="text-[10px] text-slate-400 font-bold block mb-1">
                                            {language === 'en' ? 'MIN' : 'ΕΛΑΧ'}
                                        </span>
                                        <div className="relative">
                                            <span className="absolute left-2 top-1.5 text-xs text-slate-400">€</span>
                                            <input type="number" value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} className="w-full pl-5 pr-2 py-1.5 text-xs border border-slate-200 rounded-lg font-bold focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-[10px] text-slate-400 font-bold block mb-1">
                                            {language === 'en' ? 'MAX' : 'ΜΕΓ'}
                                        </span>
                                        <div className="relative">
                                            <span className="absolute left-2 top-1.5 text-xs text-slate-400">€</span>
                                            <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full pl-5 pr-2 py-1.5 text-xs border border-slate-200 rounded-lg font-bold focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stock Status */}
                        <div className="p-5">
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm font-bold text-primary">
                                    {language === 'en' ? 'In Stock only' : 'Μόνο διαθέσιμα'}
                                </span>
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={inStockOnly} onChange={() => setInStockOnly(!inStockOnly)} />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent hover:peer-checked:bg-red-700"></div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Reset Button */}
                    <button onClick={() => { setMinPrice(0); setMaxPrice(500); setSelectedBrands([]); setCompatibleOnly(false); }} className="w-full py-3 text-sm font-bold text-slate-500 hover:text-accent border border-slate-200 rounded-xl bg-white transition-all hover:bg-slate-50">
                        {language === 'en' ? 'Reset All Filters' : 'Επαναφορά'}
                    </button>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    {loading ? (
                        <div className="flex items-center justify-center p-20">
                            <span className="material-symbols-outlined text-4xl text-accent animate-spin">progress_activity</span>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-20 text-center text-slate-400 bg-white rounded-xl border border-slate-200 shadow-sm">
                            <span className="material-symbols-outlined text-6xl mb-4">search_off</span>
                            <h3 className="text-lg font-bold text-slate-600 mb-2">{language === 'en' ? 'No products found' : 'Δεν βρέθηκαν προϊόντα'}</h3>
                            <p>{language === 'en' ? 'Try adjusting your filters or search terms.' : 'Δοκιμάστε να αλλάξετε τα φίλτρα σας.'}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {products.filter(p => inStockOnly ? p.in_stock === 1 : true).map((prod) => (
                                <div key={prod.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col">
                                    <div className="relative aspect-square bg-slate-50 p-8">
                                        <img src={prod.image} alt={prod.name} className="w-full h-full object-contain mix-blend-multiply" />
                                        {compatibleOnly && (
                                            <div className="absolute top-4 left-4 bg-green-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase flex items-center gap-1 shadow-sm">
                                                <span className="material-symbols-outlined text-xs">check_circle</span>
                                                {language === 'en' ? `Fits your ${vehicle?.make || 'Car'}` : `Ταιριάζει στο οχημα`}
                                            </div>
                                        )}
                                        {prod.in_stock === 0 && (
                                            <div className="absolute top-4 left-4 bg-red-100 text-red-600 text-[10px] font-black px-2 py-0.5 rounded uppercase flex items-center gap-1 shadow-sm">
                                                <span className="material-symbols-outlined text-xs">warning</span>
                                                {language === 'en' ? 'Out of Stock' : 'Εξαντλημένο'}
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur rounded px-2 py-1 shadow-sm text-xs font-bold text-slate-500">
                                            {prod.brand}
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SKU: {prod.part_number}</p>
                                            {prod.rating > 0 && (
                                                <div className="flex items-center gap-0.5">
                                                    <span className="material-symbols-outlined text-sm text-accent fill-1">star</span>
                                                    <span className="text-[10px] font-bold">{Number(prod.rating).toFixed(1)}</span>
                                                </div>
                                            )}
                                        </div>
                                        <a href={`/product/${prod.id}`} className="text-sm font-bold text-primary group-hover:text-accent transition-colors line-clamp-2 mb-4 h-10 block">
                                            {prod.name}
                                        </a>
                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex flex-col">
                                                {prod.original_price && <span className="text-xs text-slate-400 line-through">€{Number(prod.original_price).toFixed(2)}</span>}
                                                <span className="text-xl font-black text-primary">€{Number(prod.price).toFixed(2)}</span>
                                            </div>
                                            <button className="size-10 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-accent transition-all shadow-md">
                                                <span className="material-symbols-outlined">add_shopping_cart</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="mt-12 flex items-center justify-center gap-2">
                        <button className="size-10 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-400 transition-colors">
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <button className="size-10 flex items-center justify-center rounded-lg bg-primary text-white font-bold">1</button>
                        <button className="size-10 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-bold transition-colors">2</button>
                        <button className="size-10 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-bold transition-colors">3</button>
                        <span className="px-2 text-slate-400">...</span>
                        <button className="size-10 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-bold transition-colors border-current">12</button>
                        <button className="size-10 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-400 transition-colors">
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};
