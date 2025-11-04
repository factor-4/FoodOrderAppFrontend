import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import ApiService from "../../services/ApiService";

const Navbar = () => {
    const isAuthenticated = ApiService.isAthenticated();
    const isAdmin = ApiService.isAdmin();
    const isCustomer = ApiService.isCustomer();
    const isDeliveryPerson = ApiService.isDeliveryPerson();
    const navigate = useNavigate();

    // State to store cart item count
    const [cartCount, setCartCount] = useState(0);

    // Function to fetch cart count
    const fetchCartCount = async () => {
        if (isCustomer) {
            try {
                const response = await ApiService.getCart();
                if (response.statusCode === 200 && response.data) {
                    // Calculate total items in cart
                    const totalItems = response.data.cartItems.reduce(
                        (total, item) => total + item.quantity,
                        0
                    );
                    setCartCount(totalItems);
                } else {
                    setCartCount(0);
                }
            } catch (error) {
                console.error("Failed to fetch cart count:", error);
                setCartCount(0);
            }
        }
    };

    // Fetch cart count on component mount and when user status changes
    useEffect(() => {
        fetchCartCount();
    }, [isCustomer]);

    // Listen for cart update events from other components
    useEffect(() => {
        const handleCartUpdate = () => {
            fetchCartCount();
        };

        // Add event listener for cart updates
        window.addEventListener('cartUpdated', handleCartUpdate);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, []);

    // Logout handler
    const handleLogout = () => {
        const isLogout = window.confirm("Are you sure you want to logout?")
        if (isLogout) {
            ApiService.logout();
            navigate("/login")
        }
    }

    return (
        <nav>
            <div className="logo">
                <Link to="/" className="logo-link">
                    The Ingredient
                </Link>
            </div>

            <div className="desktop-nav">
                {/* Always visible links */}

                <Link to="/home" className="nav-link"> Home</Link>
                <Link to="/menu" className="nav-link"> Menu</Link>
                <Link to="/categories" className="nav-link"> Categories</Link>


                {isAuthenticated ? (
                    <>
                        {/* Customer specific links */}
                        {isCustomer && (
                            <>
                                {/* Cart link with badge showing item count */}
                                <Link to="/cart" className="nav-link cart-link">
                                    Cart
                                    {cartCount > 0 && (
                                        <span className="cart-count-badge">{cartCount}</span>
                                    )}
                                </Link>
                            </>
                        )}



                        {/* Admin specific links */}
                        {isAdmin && (
                            <Link to="/admin" className="nav-link"> Admin</Link>
                        )}

                        {/* Common authenticated user links */}
                        <Link to="/profile" className="nav-link"> Profile</Link>
                        <button className="nav-button" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        {/* Links for non-authenticated users */}
                        <Link to="/login" className="nav-link"> Login</Link>
                        <Link to="/register" className="nav-link"> Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;