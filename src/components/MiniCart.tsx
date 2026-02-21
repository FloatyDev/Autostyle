import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import './MiniCart.css';

export const MiniCart: React.FC = () => {
    const { cart, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen, language, cartTotal } = useAppContext();
    const navigate = useNavigate();

    if (!isCartOpen) return null;

    const handleCheckout = () => {
        setIsCartOpen(false);
        navigate('/checkout');
    };

    return (
        <>
            <div className="cart-overlay" onClick={() => setIsCartOpen(false)}></div>
            <div className="mini-cart">
                <div className="cart-header">
                    <h3>
                        <ShoppingBag size={20} style={{ marginRight: '8px' }} />
                        {language === 'en' ? 'Your Cart' : 'Το Καλάθι σας'}
                    </h3>
                    <button className="close-btn" onClick={() => setIsCartOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                <div className="cart-items">
                    {cart.length === 0 ? (
                        <div className="empty-cart">
                            <ShoppingBag size={48} className="empty-icon" />
                            <p>{language === 'en' ? 'Your cart is empty' : 'Το καλάθι σας είναι άδειο'}</p>
                            <button className="btn btn-secondary" onClick={() => setIsCartOpen(false)}>
                                {language === 'en' ? 'Continue Shopping' : 'Συνέχεια Αγορών'}
                            </button>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className="cart-item">
                                <div className="item-image">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="item-details">
                                    <h4 className="item-name">{item.name}</h4>
                                    <div className="item-price">€{item.price.toFixed(2)}</div>
                                    <div className="item-actions">
                                        <div className="quantity-ctrl">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                        </div>
                                        <button className="remove-btn" onClick={() => removeFromCart(item.id)} aria-label="Remove item">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-summary">
                            <span>{language === 'en' ? 'Subtotal' : 'Σύνολο'}:</span>
                            <span className="cart-total">€{cartTotal.toFixed(2)}</span>
                        </div>
                        <p className="tax-note">{language === 'en' ? 'Taxes and shipping calculated at checkout' : 'Φόροι και μεταφορικά υπολογίζονται στην επόμενη σελίδα'}</p>
                        <button className="btn btn-primary btn-block" onClick={handleCheckout}>
                            {language === 'en' ? 'Proceed to Checkout' : 'Ολοκλήρωση Αγοράς'}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};
