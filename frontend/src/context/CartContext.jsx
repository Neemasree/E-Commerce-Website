/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  // ✅ Lazy initialization (NO useEffect setState)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // ✅ Side-effect ONLY syncing to localStorage (allowed)
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const stockLimit = Number.isInteger(product.stock) ? Math.max(0, product.stock) : 99;
      if (stockLimit === 0) return prev;

      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        if (existing.quantity >= stockLimit) return prev;
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, ...product, quantity: Math.min(stockLimit, item.quantity + 1) }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((i) => i._id !== productId));
  };

  const updateQuantity = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item._id !== productId) return item;
        const stockLimit = Number.isInteger(item.stock) ? item.stock : 99;
        const nextQuantity = stockLimit <= 0
          ? Math.min(qty, item.quantity)
          : Math.min(qty, stockLimit);
        return { ...item, quantity: Math.max(1, nextQuantity) };
      })
    );
  };

  const clearCart = () => setCartItems([]);

  const getCartTotal = () =>
    cartItems.reduce(
      (sum, item) => sum + (item.offerPrice || item.price) * item.quantity,
      0
    );

  const getCartItemsCount = () =>
    cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const getItemQuantity = (productId) =>
    cartItems.find((item) => item._id === productId)?.quantity || 0;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
