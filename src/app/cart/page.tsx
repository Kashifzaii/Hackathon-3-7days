"use client";
import React, { useState } from "react";
import { useCart } from "../context/CardContext";
import Image from "next/image";
import { urlFor } from "../../sanity/lib/image";
import Link from "next/link";

const Page = () => {
  const { state, dispatch, totalPrice } = useCart();
  const [isCheckout, setIsCheckout] = useState(false);
  const [isOrderSummary, setIsOrderSummary] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    paymentMethod: "Credit Card",
  });

  // Admin authentication check (Replace with actual auth logic)
  const isAdmin = true; 

  const handleRemove = (id: string) => {
    dispatch({ type: "REMOVE_FROM_CART", id });
  };

  const handleQuantityChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) value = 1; 
    dispatch({ type: "UPDATE_QUANTITY", id, quantity: value });
  };

  const handleCheckoutClick = () => {
    setIsCheckout(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckout(false);
    setIsOrderSummary(true);
  };

  const handleBackToCart = () => {
    setIsCheckout(false);
    setIsOrderSummary(false);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="mb-10 px-6 sm:px-10">
        <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>

        {state.cart.length === 0 ? (
          <p className="text-xl">Your cart is empty!</p>
        ) : (
          <>
            {/* Cart View */}
            {!isCheckout && !isOrderSummary && (
              <>
                <div className="overflow-x-auto">
                  <table className="table-auto w-full border-collapse mb-8">
                    <thead>
                      <tr>
                        <th className="text-left px-4 py-2">Product</th>
                        <th className="text-left px-4 py-2">Quantity</th>
                        <th className="text-left px-4 py-2">Total</th>
                        <th className="px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.cart.map((item, index) => (
                        <tr key={item._id || index}>
                          <td className="px-4 py-6">
                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                              <Image
                                src={item.image ? urlFor(item.image).width(100).height(100).url() : "/cart2.png"}
                                alt={item.name || "Product Image"}
                                width={150}
                                height={150}
                                className="w-[150px] h-[150px] object-cover"
                              />
                              <div>
                                <h3 className="font-bold text-2xl sm:text-xl">{item.name}</h3>
                                <p className="text-gray-500 sm:text-sm">£{item.price}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity || 1}
                              onChange={(e) => handleQuantityChange(item._id, e)}
                              className="w-16 border rounded px-2 py-1"
                            />
                          </td>
                          <td className="px-4 py-2">£{(item.price * (item.quantity || 1)).toFixed(2)}</td>
                          <td className="px-4 py-2">
                            <button onClick={() => handleRemove(item._id)} className="text-red-500 hover:underline">
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="text-right">
                  <h2 className="text-xl font-bold">Subtotal: £{totalPrice.toFixed(2)}</h2>
                  <button onClick={handleCheckoutClick} className="bg-red-600 text-white py-2 px-4 rounded hover:bg-black">
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}

            {/* Checkout Form */}
            {isCheckout && !isOrderSummary && (
              <div className="flex justify-center py-8">
                <form onSubmit={handleFormSubmit} className="w-full max-w-lg p-6 border rounded shadow-lg bg-gray-900 text-white">
                  <h2 className="text-2xl font-bold text-center mb-6">Billing Address</h2>
                  <div className="space-y-4">
                    {["name", "email", "address", "city", "zip"].map((field) => (
                      <div key={field}>
                        <label className="block text-lg">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        <input
                          type={field === "email" ? "email" : "text"}
                          value={billingDetails[field as keyof typeof billingDetails]}
                          onChange={(e) => setBillingDetails({ ...billingDetails, [field]: e.target.value })}
                          required
                          className="w-full px-4 py-2 border rounded"
                        />
                      </div>
                    ))}
                    {/* Payment Method */}
                    <div>
                      <label className="block text-lg">Payment Method</label>
                      <select
                        value={billingDetails.paymentMethod}
                        onChange={(e) => setBillingDetails({ ...billingDetails, paymentMethod: e.target.value })}
                        className="w-full px-4 py-2 border rounded text-black"
                      >
                        <option value="Credit Card">Credit Card</option>
                        <option value="PayPal">PayPal</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                      </select>
                    </div>
                    <div className="text-center mt-6">
                      <button type="submit" className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-cyan-200">
                        Submit Order
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Order Summary */}
            {isOrderSummary && (
              <div className="py-8 px-6 max-w-lg mx-auto border rounded shadow-lg bg-red-900 text-white">
                <h2 className="text-2xl font-bold text-center mb-6">Order Summary</h2>
                <div>
                  {Object.entries(billingDetails).map(([key, value]) => (
                    <p key={key} className="text-lg">
                      {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                    </p>
                  ))}
                  <h3 className="text-xl font-bold mt-4">Total: £{totalPrice.toFixed(2)}</h3>
                </div>
                <div className="mt-6 text-center">
                  <button onClick={handleBackToCart} className="bg-cyan-700 text-black py-2 px-4 rounded hover:bg-cyan-200">
                    Back to Cart
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Admin Panel Access */}
      {isAdmin && (
        <div className="fixed bottom-5 right-5">
          <Link href="/admin">
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition">
              Admin Panel
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Page;



