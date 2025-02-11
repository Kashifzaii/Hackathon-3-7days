"use client";

import React, { createContext, useReducer, useContext, useEffect, ReactNode, } from "react";
import { useCart } from "../context/CardContext";
import { WishlistItem, Products } from "../../../typings";

// Wishlist state structure
interface WishlistState {
  wishlist: WishlistItem[];
  
}

// Wishlist Context Value
interface WishlistContextValue {
  state: WishlistState;
  dispatch: React.Dispatch<WishlistAction>;
  totalItems: number;
  moveToCart: (product: WishlistItem) => void;
  clearWishlist: () => void; // Admin ke liye function
}

// Action Types
type WishlistAction =
  | { type: "SET_WISHLIST"; products: WishlistItem[] }
  | { type: "ADD_TO_WISHLIST"; product: WishlistItem }
  | { type: "REMOVE_FROM_WISHLIST"; id: string }
  | { type: "CLEAR_WISHLIST" };

// Reducer function
const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case "SET_WISHLIST":
      return { wishlist: action.products };

    case "ADD_TO_WISHLIST":
      if (!state.wishlist.some((item) => item._id === action.product._id)) {
        return {
          ...state,
          wishlist: [...state.wishlist, action.product],
        };
      }
      return state;

    case "REMOVE_FROM_WISHLIST":
      return {
        ...state,
        wishlist: state.wishlist.filter((item) => item._id !== action.id),
      };

    case "CLEAR_WISHLIST":
      return { wishlist: [] };

    default:
      return state;
  }
};

// Context creation
const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

// Provider Component
export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(wishlistReducer, { wishlist: [] });

  const { dispatch: cartDispatch } = useCart(); // Ensure cart context is available

  useEffect(() => {
    try {
      const storedWishlist = localStorage.getItem("wishlist");
      if (storedWishlist) {
        dispatch({ type: "SET_WISHLIST", products: JSON.parse(storedWishlist) });
      }
    } catch (error) {
      console.error("Error loading wishlist from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
    } catch (error) {
      console.error("Error saving wishlist to localStorage:", error);
    }
  }, [state.wishlist]);

  // Move to Cart Function
  const moveToCart = (product: WishlistItem) => {
    const productWithDetails: Products = {
      ...product,
      name: product?.name || "Unknown Product",
      description: (product as any).description ?? "No description available", // ✅ Fix for missing description
    };
  
    cartDispatch({
      type: "ADD_TO_CART",
      product: { ...productWithDetails, quantity: 1 },
    });
  

    dispatch({ type: "REMOVE_FROM_WISHLIST", id: product._id });
  };

  // Clear Wishlist Function (for Admin Panel)
  const clearWishlist = () => {
    dispatch({ type: "CLEAR_WISHLIST" });
    localStorage.removeItem("wishlist");
  };

  return (
    <WishlistContext.Provider value={{ state, dispatch, totalItems: state.wishlist.length, moveToCart, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook for Wishlist
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};




