import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { Lock, CreditCard, CheckCircle, ShoppingBag } from 'lucide-react';
import './Checkout.css';

interface OrderForm {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

interface OrderConfirmation {
    orderId: number;
    total: number;
}

export const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const { cart, language, cartTotal, clearCart, setIsCartOpen } = useAppContext();
    const { user, token, addresses } = useCustomerAuth();

    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(null);

    const [form, setForm] = useState<OrderForm>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Greece',
    });

    // Pre-fill form from logged-in user's profile
    useEffect(() => {
        if (user) {
            const defaultAddress = addresses.find(a => a.is_default);
            setForm(prev => ({
                ...prev,
                firstName: user.first_name ?? '',
                lastName: user.last_name ?? '',
                email: user.email ?? '',
                phone: user.phone ?? '',
                address: defaultAddress?.street ?? '',
                city: defaultAddress?.city ?? '',
                postalCode: defaultAddress?.postal_code ?? '',
                country: defaultAddress?.country ?? 'Greece',
            }));
        }
    }, [user, addresses]);

    const TAX_RATE = 0.24;
    const shipping = cartTotal > 100 ? 0 : 5.00;
    const finalTotal = cartTotal + shipping;
    const taxAmount = (cartTotal * TAX_RATE) / (1 + TAX_RATE);
    const subtotalNet = cartTotal - taxAmount;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAddressSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    const handleShippingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(3);
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const payload = {
            customer_name: `${form.firstName} ${form.lastName}`.trim(),
            customer_email: form.email,
            phone: form.phone,
            shipping_address: form.address,
            city: form.city,
            postal_code: form.postalCode,
            country: form.country,
            cart: cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
            })),
        };

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const res = await fetch('http://localhost:8000/api/orders/checkout', {
                method: 'POST',
                headers,
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Checkout failed. Please try again.');
            }

            // Success!
            clearCart();
            setIsCartOpen(false);
            setConfirmation({ orderId: data.order_id, total: data.total_amount });
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Empty Cart State ---
    if (cart.length === 0 && !confirmation) {
        return (
            <div className="container section-padding text-center checkout-empty">
                <ShoppingBag size={60} className="checkout-empty-icon" />
                <h2>{language === 'en' ? 'Your cart is empty' : 'Το καλάθι σας είναι άδειο'}</h2>
                <p>{language === 'en' ? 'Add some parts before checking out.' : 'Προσθέστε εξαρτήματα πριν προχωρήσετε.'}</p>
                <button onClick={() => navigate('/shop')} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                    {language === 'en' ? 'Return to Shop' : 'Επιστροφή στο Κατάστημα'}
                </button>
            </div>
        );
    }

    // --- Order Confirmation State ---
    if (confirmation) {
        return (
            <div className="checkout-confirmation">
                <div className="confirmation-card">
                    <CheckCircle size={64} className="confirmation-icon" />
                    <h1>{language === 'en' ? 'Thank you for your order!' : 'Ευχαριστούμε για την παραγγελία σας!'}</h1>
                    <p className="confirmation-subtitle">
                        {language === 'en'
                            ? 'Your order has been received and is awaiting payment confirmation.'
                            : 'Η παραγγελία σας ελήφθη και αναμένει επιβεβαίωση πληρωμής.'}
                    </p>
                    <div className="confirmation-details">
                        <div className="confirmation-row">
                            <span>{language === 'en' ? 'Order ID' : 'Αριθμός Παραγγελίας'}</span>
                            <strong>#{confirmation.orderId}</strong>
                        </div>
                        <div className="confirmation-row">
                            <span>{language === 'en' ? 'Total' : 'Σύνολο'}</span>
                            <strong>€{(confirmation.total + shipping).toFixed(2)}</strong>
                        </div>
                    </div>
                    <button onClick={() => navigate('/')} className="btn btn-primary">
                        {language === 'en' ? 'Back to Home' : 'Αρχική Σελίδα'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page bg-light py-8">
            <div className="container">

                <div className="checkout-header">
                    <button onClick={() => navigate('/')} className="logo-btn">
                        AUTO<span>STYLE</span>
                    </button>
                    <h1>{language === 'en' ? 'Secure Checkout' : 'Ασφαλής Ολοκλήρωση Αγοράς'}</h1>
                    <Lock size={20} className="secure-icon" />
                </div>

                {/* Guest prompt */}
                {!user && (
                    <div className="guest-prompt">
                        <span>{language === 'en' ? 'Already have an account?' : 'Έχετε ήδη λογαριασμό;'}</span>
                        <button onClick={() => navigate('/login')} className="link-btn">
                            {language === 'en' ? 'Log in for faster checkout' : 'Συνδεθείτε για γρηγορότερη ολοκλήρωση'}
                        </button>
                    </div>
                )}

                <div className="checkout-layout">
                    <div className="checkout-main">

                        {/* Step 1: Address */}
                        <div className={`checkout-step card ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>
                            <div className="step-header">
                                <h3>1. {language === 'en' ? 'Shipping Address' : 'Διεύθυνση Αποστολής'}</h3>
                                {step > 1 && <button type="button" onClick={() => setStep(1)} className="edit-btn">Edit</button>}
                            </div>

                            {step === 1 && (
                                <form onSubmit={handleAddressSubmit} className="step-content">
                                    <div className="form-row">
                                        <div className="form-group flex-1">
                                            <label htmlFor="firstName">{language === 'en' ? 'First Name' : 'Όνομα'}</label>
                                            <input id="firstName" name="firstName" type="text" className="form-control" value={form.firstName} onChange={handleChange} required />
                                        </div>
                                        <div className="form-group flex-1">
                                            <label htmlFor="lastName">{language === 'en' ? 'Last Name' : 'Επώνυμο'}</label>
                                            <input id="lastName" name="lastName" type="text" className="form-control" value={form.lastName} onChange={handleChange} required />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">{language === 'en' ? 'Email Address' : 'Email'}</label>
                                        <input id="email" name="email" type="email" className="form-control" value={form.email} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="address">{language === 'en' ? 'Street Address' : 'Οδός & Αριθμός'}</label>
                                        <input id="address" name="address" type="text" className="form-control" value={form.address} onChange={handleChange} required />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group flex-2">
                                            <label htmlFor="city">{language === 'en' ? 'City' : 'Πόλη'}</label>
                                            <input id="city" name="city" type="text" className="form-control" value={form.city} onChange={handleChange} required />
                                        </div>
                                        <div className="form-group flex-1">
                                            <label htmlFor="postalCode">{language === 'en' ? 'Postal Code' : 'Τ.Κ.'}</label>
                                            <input id="postalCode" name="postalCode" type="text" className="form-control" value={form.postalCode} onChange={handleChange} required />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group flex-2">
                                            <label htmlFor="country">{language === 'en' ? 'Country' : 'Χώρα'}</label>
                                            <select id="country" name="country" className="form-control" value={form.country} onChange={handleChange}>
                                                <option value="Greece">Greece</option>
                                                <option value="Cyprus">Cyprus</option>
                                                <option value="Germany">Germany</option>
                                                <option value="UK">United Kingdom</option>
                                            </select>
                                        </div>
                                        <div className="form-group flex-1">
                                            <label htmlFor="phone">{language === 'en' ? 'Phone' : 'Τηλέφωνο'}</label>
                                            <input id="phone" name="phone" type="tel" className="form-control" value={form.phone} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary step-btn">
                                        {language === 'en' ? 'Continue to Shipping' : 'Συνέχεια στον Τρόπο Αποστολής'}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Step 2: Shipping */}
                        <div className={`checkout-step card ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}>
                            <div className="step-header">
                                <h3>2. {language === 'en' ? 'Shipping Method' : 'Τρόπος Αποστολής'}</h3>
                                {step > 2 && <button type="button" onClick={() => setStep(2)} className="edit-btn">Edit</button>}
                            </div>

                            {step === 2 && (
                                <form onSubmit={handleShippingSubmit} className="step-content">
                                    <div className="shipping-methods">
                                        <label className="shipping-option">
                                            <input type="radio" name="shipping" defaultChecked />
                                            <div className="shipping-details">
                                                <span className="shipping-title">{language === 'en' ? 'Standard Courier' : 'Απλή Αποστολή (Courier)'}</span>
                                                <span className="shipping-time">{language === 'en' ? '1-3 Business Days' : '1-3 Εργάσιμες'}</span>
                                            </div>
                                            <span className="shipping-price">{shipping === 0 ? (language === 'en' ? 'FREE' : 'ΔΩΡΕΑΝ') : `€${shipping.toFixed(2)}`}</span>
                                        </label>
                                    </div>
                                    <button type="submit" className="btn btn-primary step-btn">
                                        {language === 'en' ? 'Continue to Payment' : 'Συνέχεια στην Πληρωμή'}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Step 3: Payment */}
                        <div className={`checkout-step card ${step === 3 ? 'active' : ''}`}>
                            <div className="step-header">
                                <h3>3. {language === 'en' ? 'Payment' : 'Πληρωμή'}</h3>
                            </div>

                            {step === 3 && (
                                <form onSubmit={handlePlaceOrder} className="step-content">
                                    <div className="payment-alert">
                                        <CreditCard size={20} />
                                        <span>{language === 'en' ? 'Payments are securely processed by Stripe.' : 'Οι πληρωμές επεξεργάζονται με ασφάλεια μέσω Stripe.'}</span>
                                    </div>

                                    {/* Stripe PaymentElement Placeholder — replace with <Elements> + <PaymentElement /> */}
                                    <div className="stripe-element-container" id="stripe-payment-element">
                                        <div className="stripe-mock-input">
                                            <span className="stripe-placeholder-label">
                                                {language === 'en' ? 'Stripe Payment Element will load here' : 'Το στοιχείο πληρωμής Stripe θα φορτωθεί εδώ'}
                                            </span>
                                            <span className="stripe-placeholder-sublabel">
                                                {language === 'en' ? 'See stripe_integration_guide.md to connect your API key' : 'Δείτε τον οδηγό ενσωμάτωσης Stripe'}
                                            </span>
                                        </div>
                                    </div>

                                    {error && <div className="checkout-error">{error}</div>}

                                    <button
                                        type="submit"
                                        className="btn btn-primary step-btn btn-block"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting
                                            ? (language === 'en' ? 'Placing Order...' : 'Καταχώρηση...')
                                            : (language === 'en' ? `Place Order — €${finalTotal.toFixed(2)}` : `Ολοκλήρωση — €${finalTotal.toFixed(2)}`)}
                                    </button>
                                    <p className="payment-note">
                                        {language === 'en'
                                            ? 'Your order will be placed in \'pending payment\' status. Complete the integration guide to enable Stripe.'
                                            : 'Η παραγγελία θα καταχωρηθεί σε κατάσταση \'εκκρεμεί πληρωμή\'.'}
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <aside className="checkout-sidebar">
                        <div className="order-summary card">
                            <h3>{language === 'en' ? 'Order Summary' : 'Σύνοψη Παραγγελίας'}</h3>
                            <div className="summary-items">
                                {cart.map(item => (
                                    <div key={item.id} className="summary-item">
                                        <div className="summary-item-img">
                                            <img src={item.image} alt={item.name} loading="lazy" />
                                            <span className="summary-qty">{item.quantity}</span>
                                        </div>
                                        <div className="summary-item-name">{item.name}</div>
                                        <div className="summary-item-price">€{(item.price * item.quantity).toFixed(2)}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="summary-totals">
                                <div className="totals-row">
                                    <span>{language === 'en' ? 'Subtotal (Net)' : 'Καθαρή Αξία'}</span>
                                    <span>€{subtotalNet.toFixed(2)}</span>
                                </div>
                                <div className="totals-row">
                                    <span>{language === 'en' ? 'VAT (24%)' : 'ΦΠΑ (24%)'}</span>
                                    <span>€{taxAmount.toFixed(2)}</span>
                                </div>
                                <div className="totals-row">
                                    <span>{language === 'en' ? 'Shipping' : 'Μεταφορικά'}</span>
                                    <span>{shipping === 0 ? (language === 'en' ? 'FREE' : 'ΔΩΡΕΑΝ') : `€${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="totals-row final-total">
                                    <span>{language === 'en' ? 'Total' : 'Τελικό Σύνολο'}</span>
                                    <span>€{finalTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};
