import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export const Product: React.FC = () => {
    const { language, vehicle } = useAppContext();
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    const product = {
        name: 'Brembo Front Brake Pads - High Performance Ceramic Series',
        sku: 'BRE-77420-CP',
        brand: 'brembo',
        rating: 4.8,
        reviewsNum: 128,
        price: 45.99,
        originalPrice: 59.99,
        inStock: true,
        fitment: [
            'Toyota Yaris 2015-2020',
            'Honda Civic 2016-2021',
            'Mazda 3 2014-2018'
        ],
        mainImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGX3nmq3yh7I6ziLgxU4U5thL33sMGYfYf8TOcegVh8jqN84wAm6uwrTTH28ont7aQHxcpGYspzEE_AMfCFKymnkTYOzMcy8r7oGE-8ueXr5QaPcPzz9JQzGzI85-fIMhORBAJC3skBKCe9sY6VhEzcQWjWF_wx33Cdf0m1M724gvFJcH5RpZWnAfbJfwvpBHHJMUASi3sVMGEhv26RoaoGUcdfhpY7X4HukDXikicFU8jZun7omadPO_5BDJAAr3VinAWVWpePss',
        gallery: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuC6W0DQkPcwqh2QlxrKva7an9cEkCKYlJP2g-lZObCDhg7hR0IexHpKBOTYZUfsmnrIOtbU2fsbs0PP8G1T28OYE2-4GkfyJCgr-iPAv0i4E6RtDJpVkGI6Bk2sLGl394L4WhbTs73rcGnNWUhFKgQdp4pprCQiJs-Ri7zZx3FFX1cQNVIA0jdCcpAgT7H6nHsZLPrLyIo0z-uCMpxZQjk_-6OYFj-0BGOX2wLbcn7qZFq_f0N1ebAgPLhw7mcti9JCfu5dKaBLD8w',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuA5H-_6Ajf4dUEr602cHp0NAu9Sp8WEFF6HxRwvdbscc-sQmH2Us44hB1ofwA-50cv_EYpwC3TKTHcP_0QLfZZlzvhFtr-bj92UEoRWSE6hBeBzcCfWETRha6wXXrF-w-HEjq8ONitTokAKltk51NXkjtgGWyIUDsgyw5QkYP2QD0JFJHEiVJFvbWiqO7mc36bsPNb3sQP1F7xCld18UQ8GcJGa62OwTcqUYj-M5dmQg_XMYFFp7c4b4fugWOJqiX9yXS6aXEUjRJI',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDZNbvwC6o3lHTU0uJFWc69reM3RmToYbcbj9JfFIYNS0mPHTi6UBPWgE5uKDGtGTgl4ACc49wr-Kh3bHzj-RjVjAQ7n9_t09GM-T5yaaEojm7dqXsxR5HSWs1negd7eSjbG8BP8aF-SS1cDu5Ma6OlzJm07EKpvgLbJSTXTED1Qy8LnxjzfKuosxk3QGRJn1jN1_WBqQ3DPco-nuOHbBjPg5NGLYnvvFEkuRA1ZKXcIaqETMziNVeHp4HENKm9J7U6Vafcm52JZQo',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBwMZpnU3_Qimv4QLHIwXf0yGNQ2TDtoOB6fWbfHWJDBnrjvXOJw1NTrfJsZ4pMQFohzWRkwIrfVmiCG-iB0FBWQpjBigpBabfWMwG1-4rAw3tNgJ0WuNq1IxatU7vNUYoZsCMloicqxXH2mGmVYd9Lz_XEvK0Dt89pvwKrVBzNbuBfCkXBgKnAT7rlyFVc_VuEc8SflYBXi63vN_l2GGhvceH19_Ui8rbZoLOL3qE7wse5td1h9wV-wisI53YUM78B9F6WNb2nvk4'
        ]
    };

    const relatedProducts = [
        { id: 1, name: 'Brembo High Performance Brake Rotors - Set of 2', price: 112.50, brand: 'Brembo', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqdVPOpbJlkaw_PiWDqgJRNR1SLlGVhAgFVlz-h9OrbB5m4HZQVu4OdlB-SPoJpoVoAG1wfUOjtItnAM_IUIB3lO95oFz_V0ArpFnE5GYr-sah0fLFhorX0BH5qISGx5FI9z5dxwsdRyc-JMX1PpOgWpZMr4VZmWdsd7jlbN_2Jdx0gefnPk2bIxOS02hN1hhQxcKr7H0IuW04iecTMb7klAE4Emml2o793hBOWpG_cMpjv3Mzkaezf9YmYzuWH10eufJJYRpjEd0' },
        { id: 2, name: 'React Performance DOT 4 Brake Fluid - 1L', price: 18.99, brand: 'Castrol', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtNsBLMcKT_Hqg2_ZYpQXzFIBxTGLCGCAzoe-7nds6-X57jFRULlygUkSgXuAJL76_itrP9rVFDbvHVWv3yR7hTBu6MFRf15giQ_oUoLwQ7BHpW58GVbX2Y_km2J5NVyNY_Iv69XXTxz17G96ucoP3UpKypop4CbTdSamxqqh1cGexaNdCBAhDS2KEUqCF95NU7RxQX43vkG5F3DYk39q8irv4Wn0pJivLcNQON1mBOqPnIdUYLpmHkn0RsAbQwishK5CLyoV2w6g' },
        { id: 3, name: 'Front Brake Pad Wear Sensor Cable', price: 12.45, brand: 'Bosch', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUSv_GKRDGr4VIkzJoDgVr00aoW-6AH-UzGojHetoJvltTLBpaZ2PvrQbyEhC7Mnyi_ZVNOMaXB0N2xik93LhsVYt4H_ct24wFOoOU3VLaScqn9pd78mLiJMMqniNbDKXuIpOmcMqGXccmXNk5nSJNYlyGLJr9rscrsrcOtQ-BIdOS5wMEvHbPAUCgZJrzIe0ZOvExTHiBvDebHrPk866y1WUZDV0u1EZ3VhGpIGWgUowd-aVlOa29N-pgs94-KuC7tWuFSMrwUnc' },
        { id: 4, name: 'Rapid Brake & Parts Cleaner - 500ml', price: 6.99, brand: 'Liqui Moly', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDsSTgwDjIwvTYQeT8iqK1_yOTHX4C2Kmt8nsja0LkLWSG6oARVOWu98fNcxaCrho8ilHiTFOkR7NrUmlULgeokFpX91dwVx98kAupwqJ9g2jLwOLho3hhju6DWVMDw0gmWWQEi-KENB70yoO3qucopcn-T-JFDndYYVdwsOSr1W6bLReKP6_WmVItqRRnaOnd8LzUbmEgycyxSY-dykPe5Wxm1Awe1E4pBj1fDY6xStl5biWRE0X7qy3gyeu6Ii94nv4S1Jwwe5s' }
    ];

    return (
        <main className="max-w-7xl mx-auto px-4 py-6 bg-white shrink">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap">
                <a href="/" className="hover:text-primary">{language === 'en' ? 'Home' : 'Αρχική'}</a>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
                <a href="/shop" className="hover:text-primary">{language === 'en' ? 'Shop' : 'Κατάστημα'}</a>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
                <a href="/shop" className="hover:text-primary">{language === 'en' ? 'Brakes' : 'Φρένα'}</a>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
                <span className="text-slate-900 font-medium">{language === 'en' ? 'Front Brake Pads' : 'Τακάκια Φρένων'}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column: Image Gallery */}
                <div className="lg:col-span-7 space-y-4">
                    <div className="aspect-square bg-white rounded-xl overflow-hidden border border-slate-200">
                        <div className="w-full h-full bg-center bg-no-repeat bg-contain p-8 transition-transform duration-300 hover:scale-105 cursor-zoom-in" style={{ backgroundImage: `url('${product.mainImage}')` }}></div>
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                        {product.gallery.map((img, i) => (
                            <div key={i} className={`aspect-square bg-white rounded-lg overflow-hidden cursor-pointer ${i === 0 ? 'border-2 border-primary' : 'border border-slate-200 opacity-70 hover:opacity-100'}`}>
                                <div className="w-full h-full bg-center bg-no-repeat bg-cover" style={{ backgroundImage: `url('${img}')` }}></div>
                            </div>
                        ))}
                        <div className="aspect-square bg-white rounded-lg border border-slate-200 flex items-center justify-center cursor-pointer opacity-70 hover:opacity-100 bg-slate-100">
                            <span className="material-symbols-outlined text-slate-400">play_circle</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Product Details */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div>
                        <div className="flex items-start justify-between mb-4">
                            <div className="h-10 w-24 bg-white rounded border border-slate-200 p-2 flex items-center justify-center">
                                <span className="font-bold text-lg text-red-600 italic">{product.brand}</span>
                            </div>
                            <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">SKU: {product.sku}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 leading-tight mb-2">
                            {language === 'en' ? product.name : 'Τακάκια Φρένων Εμπρός Brembo - Κεραμική Σειρά Υψηλών Επιδόσεων'}
                        </h1>
                        <div className="flex items-center gap-4">
                            <div className="flex text-amber-400">
                                <span className="material-symbols-outlined text-base fill-1">star</span>
                                <span className="material-symbols-outlined text-base fill-1">star</span>
                                <span className="material-symbols-outlined text-base fill-1">star</span>
                                <span className="material-symbols-outlined text-base fill-1">star</span>
                                <span className="material-symbols-outlined text-base">star_half</span>
                            </div>
                            <span className="text-sm text-slate-500">({product.reviewsNum} {language === 'en' ? 'Reviews' : 'Αξιολογήσεις'})</span>
                        </div>
                    </div>

                    <div className="py-6 border-y border-slate-200">
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-4xl font-bold text-slate-900">€{product.price.toFixed(2)}</span>
                            {product.originalPrice && <span className="text-slate-500 line-through">€{product.originalPrice.toFixed(2)}</span>}
                        </div>
                        <p className="text-sm text-green-600 font-medium">
                            {language === 'en' ? 'In Stock - Ready to ship' : 'Άμεσα διαθέσιμο'}
                        </p>
                    </div>

                    {/* Compatibility Widget */}
                    <div className="bg-primary/[0.05] border border-primary/10 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="material-symbols-outlined text-primary">check_circle</span>
                            <h3 className="font-semibold text-slate-900">{language === 'en' ? 'Vehicle Compatibility' : 'Συμβατότητα Οχήματος'}</h3>
                        </div>
                        {vehicle?.make ? (
                            <p className="text-sm text-slate-600 mb-2 font-bold text-green-600">
                                {language === 'en' ? 'Confirmed to fit your vehicle:' : 'Συμβατό με το όχημά σας:'} <br />
                                {vehicle.make} {vehicle.model} {vehicle.year}
                            </p>
                        ) : (
                            <>
                                <p className="text-sm text-slate-600 mb-2">{language === 'en' ? 'This part is confirmed to fit:' : 'Αυτό το εξάρτημα ταιριάζει σε:'}</p>
                                <ul className="text-sm space-y-1 font-medium">
                                    {product.fitment.map((fit, idx) => (
                                        <li key={idx} className="flex items-center gap-2">• {fit}</li>
                                    ))}
                                </ul>
                            </>
                        )}
                        <button className="mt-4 text-xs font-bold uppercase tracking-wider text-primary hover:underline flex items-center gap-1">
                            {language === 'en' ? 'Check your vehicle' : 'Ελέγξτε το όχημά σας'} <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </button>
                    </div>

                    {/* Add to Cart Actions */}
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-4">
                            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden shrink-0">
                                <button className="px-3 py-3 hover:bg-slate-100" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                <input
                                    className="w-12 text-center border-none focus:ring-0 bg-transparent"
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                />
                                <button className="px-3 py-3 hover:bg-slate-100" onClick={() => setQuantity(quantity + 1)}>+</button>
                            </div>
                            <button className="flex-1 bg-accent hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                <span className="material-symbols-outlined">shopping_bag</span>
                                {language === 'en' ? 'ADD TO CART' : 'ΠΡΟΣΘΗΚΗ'}
                            </button>
                        </div>
                        <button className="w-full border-2 border-primary text-primary font-bold py-3 rounded-lg hover:bg-primary hover:text-white transition-all">
                            {language === 'en' ? 'BUY IT NOW' : 'ΑΜΕΣΗ ΑΓΟΡΑ'}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">local_shipping</span>
                            {language === 'en' ? 'Free Delivery Over €100' : 'Δωρεάν Μεταφορικά άνω των €100'}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">history</span>
                            {language === 'en' ? '30-Day Returns' : 'Επιστροφές σε 30 μέρες'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Tabs */}
            <div className="mt-16">
                <div className="flex border-b border-slate-200 overflow-x-auto">
                    {[
                        { id: 'description', labelEn: 'DESCRIPTION', labelGr: 'ΠΕΡΙΓΡΑΦΗ' },
                        { id: 'specs', labelEn: 'SPECIFICATIONS', labelGr: 'ΠΡΟΔΙΑΓΡΑΦΕΣ' },
                        { id: 'reviews', labelEn: `REVIEWS (${product.reviewsNum})`, labelGr: `ΑΞΙΟΛΟΓΗΣΕΙΣ (${product.reviewsNum})` },
                        { id: 'shipping', labelEn: 'SHIPPING & RETURNS', labelGr: 'ΑΠΟΣΤΟΛΕΣ & ΕΠΙΣΤΡΟΦΕΣ' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-8 py-4 text-sm font-bold whitespace-nowrap transition-colors ${activeTab === tab.id
                                    ? 'border-b-2 border-primary text-primary'
                                    : 'text-slate-500 hover:text-primary border-b-2 border-transparent'
                                }`}
                        >
                            {language === 'en' ? tab.labelEn : tab.labelGr}
                        </button>
                    ))}
                </div>

                <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                    {activeTab === 'description' && (
                        <>
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold">Uncompromising Stopping Power</h2>
                                <p className="text-slate-600 leading-relaxed">
                                    Brembo's High Performance Ceramic Series brake pads are designed for drivers who demand the absolute best in braking performance without sacrificing comfort. Engineered using advanced ceramic compounds, these pads provide superior stopping power, low dust output, and nearly silent operation.
                                </p>
                                <ul className="space-y-2 text-slate-600">
                                    <li className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                                        Multilayer ESE (Elastomer-Steel-Elastomer) shims for noise reduction
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                                        Consistent braking feel across a wide range of temperatures
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                                        OE-equivalent fit and finish
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                <h3 className="font-bold mb-4">Technical Highlights</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between py-2 border-b border-slate-200">
                                        <span className="text-slate-500">Material</span>
                                        <span className="font-medium">Premium Ceramic Compound</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-slate-200">
                                        <span className="text-slate-500">Thickness</span>
                                        <span className="font-medium">17.5 mm</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-slate-200">
                                        <span className="text-slate-500">Placement</span>
                                        <span className="font-medium">Front Axle</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-slate-200">
                                        <span className="text-slate-500">Warranty</span>
                                        <span className="font-medium">2-Year Limited</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Related Products Section */}
            <section className="mt-20">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold">{language === 'en' ? 'Frequently Bought Together' : 'Αγοράζονται Συχνά Μαζί'}</h2>
                    <div className="flex gap-2">
                        <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100">
                            <span className="material-symbols-outlined text-slate-500">chevron_left</span>
                        </button>
                        <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100">
                            <span className="material-symbols-outlined text-slate-500">chevron_right</span>
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {relatedProducts.map(prod => (
                        <div key={prod.id} className="group cursor-pointer flex flex-col">
                            <div className="aspect-square bg-white rounded-xl overflow-hidden mb-4 border border-slate-100 relative">
                                <div className="w-full h-full bg-center bg-no-repeat bg-cover group-hover:scale-105 transition-transform duration-300" style={{ backgroundImage: `url('${prod.image}')` }}></div>
                                <button className="absolute bottom-4 right-4 bg-white shadow-lg p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="material-symbols-outlined text-primary">add_shopping_cart</span>
                                </button>
                            </div>
                            <p className="text-xs text-slate-400 font-bold uppercase mb-1">{prod.brand}</p>
                            <h3 className="font-bold text-sm mb-1 line-clamp-2 h-10">{prod.name}</h3>
                            <p className="font-bold text-primary mt-auto">€{prod.price.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
};
