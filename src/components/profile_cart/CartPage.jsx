import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ApiService from '../../services/ApiService';
import { useError } from '../common/ErrorDisplay';

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const navigate = useNavigate();
    const { ErrorDisplay, showError } = useError();
    const [message, setMessage] = useState(null);

    // Function to fetch cart data from API
    const fetchCart = async () => {
        try {
            const response = await ApiService.getCart();
            if (response.statusCode === 200) {
                setCart(response.data);
            } else {
                showError(response.message);
            }
        } catch (error) {
            showError(error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // Function to increase item quantity
    const handleIncrement = async (menuId) => {
        try {
            const response = await ApiService.incrementItem(menuId);
            if (response.statusCode === 200) {
                fetchCart();
                // Trigger cart update event for navbar
                window.dispatchEvent(new Event('cartUpdated'));
            }
        } catch (error) {
            showError(error.response?.data?.message || error.message);
        }
    };

    // Function to decrease item quantity
    const handleDecrement = async (menuId) => {
        try {
            const response = await ApiService.decrementItem(menuId);
            if (response.statusCode === 200) {
                fetchCart();
                // Trigger cart update event for navbar
                window.dispatchEvent(new Event('cartUpdated'));
            }
        } catch (error) {
            showError(error.response?.data?.message || error.message);
        }
    };

    // Function to remove item from cart
    const handleRemove = async (cartItemId) => {
        try {
            const response = await ApiService.removeItem(cartItemId);
            if (response.statusCode === 200) {
                fetchCart();
                // Trigger cart update event for navbar
                window.dispatchEvent(new Event('cartUpdated'));
            }
        } catch (error) {
            showError(error.response?.data?.message || error.message);
        }
    };

    // Function to handle checkout process
    const handleCheckout = async () => {
        try {
            const response = await ApiService.placeOrder();
            if (response.statusCode === 200) {
                setMessage(response.message);
                // Trigger cart update event for navbar (cart will be empty after checkout)
                window.dispatchEvent(new Event('cartUpdated'));
                setTimeout(() => {
                    setMessage(null);
                    fetchCart();
                    navigate('/my-order-history');
                }, 5000);
            }
        } catch (error) {
            showError(error.response?.data?.message || error.message);
        }
    };

    // Show empty cart message if cart is empty
    if (!cart || cart.cartItems.length === 0) {
        return (
            <div className="cart-container empty">
                <div className="empty-cart">
                    <h2>Your cart is empty</h2>
                    <p>Browse our menu to add delicious items to your cart</p>
                    <button onClick={() => navigate('/menu')} className="browse-btn">
                        Browse Menu
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-container">
            {/* Error display component */}
            <ErrorDisplay />

            {/* Success message display */}
            {message && (
                <p className="success">{message}</p>
            )}

            <h1 className="cart-title">Your Shopping Cart</h1>

            {/* Cart items list */}
            <div className="cart-items">
                {cart.cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                        <div className="item-image-container">
                            <img
                                src={item.menu.imageUrl}
                                alt={item.menu.name}
                                className="item-image"
                            />
                        </div>

                        <div className="item-details">
                            <h3 className="item-name">{item.menu.name}</h3>
                            <p className="item-description">{item.menu.description}</p>
                            <p className="item-price">${item.pricePerUnit.toFixed(2)} each</p>

                            <div className="quantity-controls">
                                <button
                                    onClick={() => handleDecrement(item.menu.id)}
                                    className="quantity-btn"
                                    disabled={item.quantity <= 1}
                                >
                                    -
                                </button>
                                <span className="quantity">{item.quantity}</span>
                                <button
                                    onClick={() => handleIncrement(item.menu.id)}
                                    className="quantity-btn"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="item-subtotal">
                            <p>${item.subtotal.toFixed(2)}</p>
                            <button
                                onClick={() => handleRemove(item.id)}
                                className="remove-btn"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Cart summary section */}
            <div className="cart-summary">
                <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>${cart.totalAmount.toFixed(2)}</span>
                </div>

                <div className="summary-row total">
                    <span>Total:</span>
                    <span>${(cart.totalAmount).toFixed(2)}</span>
                </div>

                <button
                    onClick={handleCheckout}
                    className="checkout-btn"
                >
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
};

export default CartPage;