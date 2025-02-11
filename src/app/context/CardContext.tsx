"use client";

import React, { createContext, useReducer, useContext, useEffect, ReactNode } from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  quantity: number;
}

interface CartState {
  cart: Product[];
}

type CartAction =
  | { type: "ADD_TO_CART"; product: Product }
  | { type: "REMOVE_FROM_CART"; id: string }
  | { type: "UPDATE_QUANTITY"; id: string; quantity: number }
  | { type: "CLEAR_CART" };

interface CartContextValue {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  totalItems: number;
  totalPrice: number;
  clearCart: () => void; // Admin ke liye clear cart function
}

const CartContext = createContext<CartContextValue | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingProductIndex = state.cart.findIndex((item) => item._id === action.product._id);
      if (existingProductIndex >= 0) {
        const updatedCart = [...state.cart];
        updatedCart[existingProductIndex].quantity += action.product.quantity || 1;
        return { ...state, cart: updatedCart };
      }
      return { ...state, cart: [...state.cart, action.product] };
    }
    case "REMOVE_FROM_CART":
      return { ...state, cart: state.cart.filter((item) => item._id !== action.id) };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item._id === action.id ? { ...item, quantity: action.quantity } : item
        ),
      };
    case "CLEAR_CART":
      return { ...state, cart: [] };
    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, { cart: [] });

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      dispatch({ type: "CLEAR_CART" }); // Pehle cart clear kar ke naye data load kar raha hai
      const parsedCart = JSON.parse(savedCart);
      parsedCart.forEach((product: Product) => {
        dispatch({ type: "ADD_TO_CART", product });
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.cart));
  }, [state.cart]);

  const totalItems = state.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalPrice = state.cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const clearCart = () => dispatch({ type: "CLEAR_CART" }); // Admin ke liye function

  return (
    <CartContext.Provider value={{ state, dispatch, totalItems, totalPrice, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
