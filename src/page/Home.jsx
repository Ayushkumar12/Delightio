import React, { useState, useEffect } from "react";
import Footer from '../comp/Footer';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set } from "firebase/database";
// Note: fetching menu via backend API instead of Firebase client

const firebaseConfig = {
  apiKey: "AIzaSyBnnUtNzcnw0UYR8ikFJptHkuzZFkvp4k4",
  authDomain: "online-food-order-80833.firebaseapp.com",
  databaseURL: "https://online-food-order-80833-default-rtdb.firebaseio.com",
  projectId: "online-food-order-80833",
  storageBucket: "online-food-order-80833.appspot.com",
  messagingSenderId: "980243962311",
  appId: "1:980243962311:web:6c80cf64470477b1bc21e2",
  measurementId: "G-FF4PLG3S2T",
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
function Home() {
  const [menuItems, setMenuItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [Table, setTable] = useState("");
  const [show, setShow] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [clickEffect, setClickEffect] = useState(false);
  
  
  const Handleclick = () => {
    setShow(!show);
  };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("http://localhost:3001/menu");
        if (!res.ok) throw new Error(`Failed to fetch menu: ${res.status}`);
        const data = await res.json();
        const menuItemsArray = Array.isArray(data) ? data : Object.values(data || {});
        setMenuItems(menuItemsArray);
      } catch (err) {
        console.error("Error fetching menu:", err);
      }
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    calculateTotalCost();
  }, [cartItems]);

  const handleAddToCart = (menuItem) => {
    setClickEffect(true);
    setCartCount(prev => prev + 1);
    setTimeout(() => setClickEffect(false), 300);
    const existingCartItem = cartItems.find(
      (cartItem) => cartItem.dish_Id === menuItem.dish_Id
    );
    if (existingCartItem) {
      const updatedCartItems = cartItems.map((cartItem) => {
        if (cartItem.dish_Id === menuItem.dish_Id) {
          return { ...cartItem, quantity: cartItem.quantity + 1 };
        } else {
          return cartItem;
        }
      });
      setCartItems(updatedCartItems);
    } else {
      setCartItems([...cartItems, { ...menuItem, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (menuItem) => {
    const updatedCartItems = cartItems.filter(
      (cartItem) => cartItem.dish_Id !== menuItem.dish_Id
    );
    setCartItems(updatedCartItems);
  };

  const incrementQty = (menuItem) => {
    setCartItems(prev => prev.map(ci => ci.dish_Id === menuItem.dish_Id ? { ...ci, quantity: ci.quantity + 1 } : ci));
  };

  const decrementQty = (menuItem) => {
    setCartItems(prev => prev.flatMap(ci => {
      if (ci.dish_Id !== menuItem.dish_Id) return [ci];
      const nextQty = ci.quantity - 1;
      return nextQty <= 0 ? [] : [{ ...ci, quantity: nextQty }];
    }));
  };

  const calculateTotalCost = () => {
    const total = cartItems.reduce((acc, cartItem) => acc + Number(cartItem.dish_Price) * Number(cartItem.quantity), 0);
    setTotalCost(total);
  };

  const handleSubmitOrder = async () => {
    if (!customerName || !Table) {
      alert("Please enter customer name and table number");
      return;
    }
    if (cartItems.length === 0) {
      alert("No items in the cart");
      return;
    }
    try {
      const res = await fetch("http://localhost:3001/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          Table,
          restaurantId: "12345",
          menuItems: cartItems,
          totalCost,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit order");
      alert("Order submitted successfully");
      setCartItems([]);
      setTotalCost(0);
    } catch (error) {
      console.error(error);
      alert("There was an error submitting your order. Please try again.");
    }
  };


  return (
    <section>
      <main className="bg-stone-50" style={{ fontFamily: 'Epilogue, Noto Sans, sans-serif' }}>
        <div className="relative flex min-h-screen w-full flex-col">
          {/* Header */}
          

          {/* Main content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Hero + Menu */}
              <div className="lg:col-span-2">
                {/* Hero */}
                <div
                  className="bg-cover bg-center flex flex-col justify-end overflow-hidden rounded-lg h-64 md:h-80 shadow-sm"
                  style={{ backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 40%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAxE55LHUC2YowEQTCZdRKXyCXXPpnerZ5sE0pH1kXBxP4CNQt2j5kiL77j1aEpP7Of5xx5_kSNPXdYEWOwwaZ1dZwCyqKz9Xep5XbVNY-z5jeJh_UZ1NpO6IGTHX8KOt56xRg9TxRI88Or7Fzlicg6Z7_Akx-rzz9eG8tos17qJGlmbpTuIWGFgGx9zaW2tfzQagnpPMHuPB5N2JV1ZiIUKqRVb1K6JpRDgmVjEcUFkKIjtAzKIF5mYWwKgKylHejsIDS1o1fDFcY")' }}
                >
                  <div className="p-6">
                    <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight drop-shadow-md">Welcome to Delightio</h2>
                    <p className="text-white text-lg mt-2 drop-shadow-md">Delicious food, delivered to you.</p>
                  </div>
                </div>

                {/* Menu */}
                <section className="mt-12" id="menu">
                  <div>
                    <h3 className="text-stone-800 text-2xl md:text-3xl font-bold leading-tight tracking-[-0.015em] px-4 pb-4">Menu</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Array.isArray(menuItems) && menuItems.length > 0 ? (
                        menuItems.map((menuItem) => (
                          <div key={menuItem.dish_Id} className="bg-white rounded-lg shadow-sm overflow-hidden group">
                            <div className="relative">
                              <div
                                className="h-48 bg-cover bg-center"
                                style={{ backgroundImage: `url(${menuItem.imageUrl})` }}
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300"></div>
                            </div>
                            <div className="p-4">
                              <h4 className="text-stone-800 text-lg font-bold leading-tight">{menuItem.dish_Name}</h4>
                              <p className="text-stone-600 text-sm font-normal leading-normal mt-1">A chef special prepared fresh for you.</p>
                              <div className="flex justify-between items-center mt-4">
                                <p className="text-stone-800 text-lg font-bold">${menuItem.dish_Price}</p>
                                <button
                                  className="bg-[var(--primary-color)] text-white rounded-md px-4 py-2 text-sm font-bold hover:bg-opacity-90 transition-colors"
                                  onClick={() => handleAddToCart(menuItem)}
                                >
                                  Add to Cart
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-stone-600 px-4">No menu items available.</p>
                      )}
                    </div>
                  </div>
                </section>
              </div>

              {/* Right: Cart */}
              <aside className="lg:col-span-1">
                <div className="sticky top-24">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-stone-800 text-xl font-bold border-b border-stone-200 pb-4">Your Order</h3>

                    {cartItems.length === 0 ? (
                      <div className="py-6 text-center text-stone-500">
                        <span className="material-symbols-outlined text-4xl">shopping_cart_off</span>
                        <p className="mt-2 text-sm">Your cart is empty.</p>
                        <p className="text-xs">Add items from the menu to get started.</p>
                      </div>
                    ) : (
                      <div className="pt-4">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-stone-500">
                              <th className="text-left font-medium py-2">Dish</th>
                              <th className="text-right font-medium py-2">Price</th>
                              <th className="text-right font-medium py-2">Qty</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cartItems.map((cartItem) => (
                              <tr key={cartItem.dish_Id + cartItem.dish_Name} className="border-t border-stone-200">
                                <td className="py-2 pr-2">{cartItem.dish_Name}</td>
                                <td className="py-2 text-right">${cartItem.dish_Price}</td>
                                <td className="py-2 text-right">
                                  <div className="inline-flex items-center gap-2">
                                    <button className="size-6 rounded border border-stone-300 hover:bg-stone-100" onClick={() => decrementQty(cartItem)}>-</button>
                                    <span className="min-w-6 text-center">{cartItem.quantity}</span>
                                    <button className="size-6 rounded border border-stone-300 hover:bg-stone-100" onClick={() => incrementQty(cartItem)}>+</button>
                                    <button className="ml-3 text-red-600 hover:underline text-xs" onClick={() => handleRemoveFromCart(cartItem)}>Remove</button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Totals */}
                        <div className="border-t border-stone-200 pt-4 space-y-2 mt-2">
                          <div className="flex justify-between text-base font-medium text-stone-600">
                            <p>Subtotal</p>
                            <p>${Number(totalCost).toFixed(2)}</p>
                          </div>
                          <div className="flex justify-between text-base font-medium text-stone-600">
                            <p>Taxes (5%)</p>
                            <p>${(Number(totalCost) * 0.05).toFixed(2)}</p>
                          </div>
                          <div className="flex justify-between text-lg font-bold text-stone-800">
                            <p>Total</p>
                            <p>${(Number(totalCost) * 1.05).toFixed(2)}</p>
                          </div>
                        </div>

                        {/* Customer info */}
                        <div className="mt-4 space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-stone-700">Customer Name</label>
                            <input
                              className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                              type="text"
                              value={customerName}
                              required
                              placeholder="John Doe"
                              onChange={(e) => setCustomerName(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-stone-700">Table</label>
                            <input
                              className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                              type="text"
                              value={Table}
                              required
                              placeholder="T4675"
                              onChange={(e) => setTable(e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mt-6">
                          <button
                            className="flex-1 bg-stone-200 text-stone-800 rounded-md py-2 text-sm font-bold hover:bg-stone-300 transition-colors"
                            onClick={() => setCartItems([])}
                          >
                            Reset
                          </button>
                          <button
                            className="flex-1 bg-[var(--primary-color)] text-white rounded-md py-2 text-sm font-bold hover:bg-opacity-90 transition-colors"
                            onClick={handleSubmitOrder}
                          >
                            Checkout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </section>
  );
}

export default Home;
