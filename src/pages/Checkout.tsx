import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Lock, CreditCard } from 'lucide-react';
import './Checkout.css';

// Stripe Mocks - In a real setting we'd import loadStripe and use <Elements> wrapper here
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

export const Checkout: React.FC = () => {
    const { cart, language, cartTotal } = useAppContext();
    const [step, setStep] = useState(1); // 1 = Address, 2 = Shipping, 3 = Payment

    const TAX_RATE = 0.24; // Greek VAT 24%
    const taxAmount = cartTotal * TAX_RATE;
    const subtotalNet = cartTotal - taxAmount;
    const shipping = cartTotal > 100 ? 0 : 5.00;
    const finalTotal = cartTotal + shipping;

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(step + 1);
    };

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Mock Payment Processed. Order Confirmed!');
        // Handle actual Stripe submission logic
    };

    if (cart.length === 0) {
        return (
            <div className="container section-padding text-center">
                <h2>{language === 'en' ? 'Your cart is empty' : 'Το καλάθι σας είναι άδειο'}</h2>
                <a href="/shop" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                    {language === 'en' ? 'Return to Shop' : 'Επιστροφή στο Κατάστημα'}
                </a>
            </div>
        );
    }

    return (
        <div className="checkout-page bg-light py-8">
            <div className="container">

                <div className="checkout-header">
                    <a href="/" className="logo">
                        AUTO<span>STYLE</span>
                        <div className="logo-accent"></div>
                    </a>
                    <h1>{language === 'en' ? 'Secure Checkout' : 'Ασφαλής Ολοκλήρωση Αγοράς'}</h1>
                    <Lock size={20} className="secure-icon" />
                </div>

                <div className="checkout-layout">
                    {/* Main Checkout Flow */}
                    <div className="checkout-main">

                        {/* Step 1: Address */}
                        <div className={`checkout-step card ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>
                            <div className="step-header">
                                <h3>1. {language === 'en' ? 'Shipping Address' : 'Διεύθυνση Αποστολής'}</h3>
                                {step > 1 && <button onClick={() => setStep(1)} className="edit-btn">Edit</button>}
                            </div>

                            {step === 1 && (
                                <form onSubmit={handleNextStep} className="step-content">
                                    <div className="form-row">
                                        <div className="form-group flex-1">
                                            <label>{language === 'en' ? 'First Name' : 'Όνομα'}</label>
                                            <input type="text" className="form-control" required />
                                        </div>
                                        <div className="form-group flex-1">
                                            <label>{language === 'en' ? 'Last Name' : 'Επώνυμο'}</label>
                                            <input type="text" className="form-control" required />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>{language === 'en' ? 'Street Address' : 'Οδός & Αριθμός'}</label>
                                        <input type="text" className="form-control" required />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group flex-2">
                                            <label>{language === 'en' ? 'City' : 'Πόλη'}</label>
                                            <input type="text" className="form-control" required />
                                        </div>
                                        <div className="form-group flex-1">
                                            <label>{language === 'en' ? 'Postal Code' : 'Τ.Κ.'}</label>
                                            <input type="text" className="form-control" required />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>{language === 'en' ? 'Phone Number' : 'Τηλέφωνο'}</label>
                                        <input type="tel" className="form-control" required />
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
                                {step > 2 && <button onClick={() => setStep(2)} className="edit-btn">Edit</button>}
                            </div>

                            {step === 2 && (
                                <form onSubmit={handleNextStep} className="step-content">
                                    <div className="shipping-methods">
                                        <label className="shipping-option">
                                            <input type="radio" name="shipping" defaultChecked />
                                            <div className="shipping-details">
                                                <span className="shipping-title">{language === 'en' ? 'Standard Courier' : 'Απλή Αποστολή (Courier)'}</span>
                                                <span className="shipping-time">{language === 'en' ? '1-3 Business Days' : '1-3 Εργάσιμες'}</span>
                                            </div>
                                            <span className="shipping-price">€5.00</span>
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
                                <form onSubmit={handlePayment} className="step-content">
                                    <div className="payment-alert">
                                        <CreditCard size={20} />
                                        <span>{language === 'en' ? 'Payments are securely processed by Stripe.' : 'Οι πληρωμές επεξεργάζονται με ασφάλεια μέσω Stripe.'}</span>
                                    </div>

                                    {/* Stripe Card Element Placeholder */}
                                    <div className="stripe-element-container">
                                        <div className="stripe-mock-input">
                                            {language === 'en' ? 'Card number     MM/YY     CVC' : 'Αριθμός Κάρτας     ΜΜ/ΕΕ     CVC'}
                                        </div>
                                    </div>

                                    <button type="submit" className="btn btn-primary step-btn btn-block">
                                        {language === 'en' ? `Pay €${finalTotal.toFixed(2)}` : `Πληρωμή €${finalTotal.toFixed(2)}`}
                                    </button>
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
                                            <img src={item.image} alt={item.name} />
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
                                    <span>€{shipping.toFixed(2)}</span>
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
