import {
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "../services/api";
const CartContext = createContext(null);

export default CartContext;

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  function getToken() {
    return localStorage.getItem("token");
  }

  useEffect(() => {
    if (!getToken()) {
      return;
    }

    let cancelled = false;

    async function fetchCart() {
      try {
        const response = await api.get("/cart");

        if (!cancelled) {
          setCart(response.data.cart);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load cart:", error);
        }
      }
    }

    fetchCart();

    return () => {
      cancelled = true;
    };
  }, []);

  async function loadCart() {
    if (!getToken()) {
      setCart(null);
      return;
    }

    try {
      setLoading(true);

      const response = await api.get("/cart");

      setCart(response.data.cart);

      return response.data;
    } catch (error) {
      console.error("Failed to load cart:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function addToCart(productId, quantity = 1) {
    if (!getToken()) {
      throw new Error(
        "Please login before adding products to your cart."
      );
    }

    try {
      setLoading(true);

      const response = await api.post("/cart", {
        product_id: productId,
        quantity,
      });

      setCart(response.data.cart);

      return response.data;
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function updateCartItem(cartItemId, quantity) {
    try {
      setLoading(true);

      const response = await api.put(
        `/cart/items/${cartItemId}`,
        {
          quantity,
        }
      );

      setCart(response.data.cart);

      return response.data;
    } catch (error) {
      console.error("Failed to update cart item:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function removeFromCart(cartItemId) {
    try {
      setLoading(true);

      const response = await api.delete(
        `/cart/items/${cartItemId}`
      );

      setCart(response.data.cart);

      return response.data;
    } catch (error) {
      console.error("Failed to remove cart item:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  function clearCart() {
    setCart(null);
  }

  const cartCount = useMemo(() => {
    if (!cart?.items) {
      return 0;
    }

    return cart.items.reduce(
      (total, item) => total + Number(item.quantity),
      0
    );
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    if (!cart?.items) {
      return 0;
    }

    return cart.items.reduce((total, item) => {
      const product = item.product;

      if (!product) {
        return total;
      }

      const price =
        product.discount_price !== null &&
        product.discount_price !== undefined
          ? Number(product.discount_price)
          : Number(product.price);

      return (
        total +
        price * Number(item.quantity)
      );
    }, 0);
  }, [cart]);

  const value = {
    cart,
    loading,
    cartCount,
    cartSubtotal,
    loadCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}