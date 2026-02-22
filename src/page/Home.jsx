import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  User,
  Hash,
  ChevronRight,
  Star,
  Clock,
  Flame
} from "lucide-react";
import Navbar from '../comp/Navbar';

const FALLBACK_MENU_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000";
const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || (typeof window !== "undefined" && window.location.hostname === "localhost" ? "http://localhost:3001" : "https://delightio.onrender.com")).replace(/\/$/, "");

const formatCurrency = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
}).format(Number(value) || 0);

function Home() {
  const [menuItems, setMenuItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [Table, setTable] = useState("");
  const location = useLocation();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/menu`);
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

  const calculateTotalCost = useCallback(() => {
    const total = cartItems.reduce((acc, cartItem) => acc + Number(cartItem.dish_Price) * Number(cartItem.quantity), 0);
    setTotalCost(total);
  }, [cartItems]);

  useEffect(() => {
    calculateTotalCost();
  }, [calculateTotalCost]);

  useEffect(() => {
    if (!location) return;
    const params = new URLSearchParams(location.search);
    const paymentStatus = params.get("payment");
    if (paymentStatus === "success") {
      setCartItems([]);
      setTotalCost(0);
      setCustomerName("");
      setTable("");
    }
  }, [location]);

  const handleAddToCart = (menuItem) => {
    const existingCartItem = cartItems.find(item => item.dish_Id === menuItem.dish_Id);
    if (existingCartItem) {
      setCartItems(cartItems.map(item => item.dish_Id === menuItem.dish_Id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCartItems([...cartItems, { ...menuItem, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (menuItem) => {
    setCartItems(cartItems.filter(item => item.dish_Id !== menuItem.dish_Id));
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

  const handleSubmitOrder = async () => {
    if (!customerName || !Table) {
      alert("Please enter customer name and table number");
      return;
    }
    if (cartItems.length === 0) {
      alert("No items in the cart");
      return;
    }
    const successUrl = `${window.location.origin}?payment=success`;
    const cancelUrl = `${window.location.origin}?payment=cancelled`;
    try {
      const res = await fetch(`${API_BASE_URL}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          Table,
          menuItems: cartItems,
          totalCost: Number(totalCost),
          successUrl,
          cancelUrl,
        }),
      });
      if (!res.ok) throw new Error("Failed to initiate checkout");
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
    } catch (error) {
      console.error(error);
      alert("Checkout error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2000"
            className="w-full h-full object-cover opacity-30"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/70 to-slate-950"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass border border-amber-500/20 text-amber-500 text-xs font-black tracking-widest mb-6 uppercase">
              <Flame size={14} />
              A Symphony of Flavors
            </span>
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight leading-tight">
              Culinary Artistry <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Reimagined</span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
              Experience an exquisite journey where tradition meets innovation. Every dish is a masterpiece crafted with passion and the finest seasonal ingredients.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })} className="btn-primary text-lg px-10 py-5 shadow-amber-500/10 shadow-2xl">
                Explore the Menu
                <ChevronRight size={20} />
              </button>
              <button onClick={() => window.location.href = '/about'} className="btn-outline text-lg px-10 py-5 font-bold border-white/10 hover:border-amber-500/50">
                Our Heritage
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Menu Section */}
          <div className="lg:col-span-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16" id="menu">
              <div>
                <span className="text-xs font-black text-amber-500 uppercase tracking-[0.4em] mb-3 block">Epicurean Selections</span>
                <h2 className="text-5xl font-black mb-4">The Menu</h2>
                <p className="text-slate-400 text-lg border-l-2 border-amber-500/30 pl-4 font-medium italic">"Where every ingredient tells a story of origin and excellence."</p>
              </div>
              <div className="hidden md:flex gap-4 mt-6 md:mt-0">
                <div className="glass px-5 py-3 rounded-2xl flex items-center gap-3 text-sm border-white/5">
                  <Clock size={18} className="text-amber-500" />
                  <span className="font-bold">25-35 MIN</span>
                </div>
                <div className="glass px-5 py-3 rounded-2xl flex items-center gap-3 text-sm border-white/5">
                  <Star size={18} className="text-amber-500" />
                  <span className="font-bold">4.9 EXCELLENCE</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {menuItems.map((item, idx) => (
                <motion.div
                  key={item.dish_Id || idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card group overflow-hidden"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={item.imageUrl || FALLBACK_MENU_IMAGE}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={item.dish_Name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                    <div className="absolute top-5 right-5 glass p-2.5 rounded-xl text-amber-500 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                      <Star size={18} fill="currentColor" />
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-2xl font-black text-white group-hover:text-amber-500 transition-colors uppercase tracking-tight">{item.dish_Name}</h3>
                      <span className="text-xl font-black text-amber-500">{formatCurrency(item.dish_Price)}</span>
                    </div>
                    <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium italic">
                      {item.description || "A signature masterpiece prepared with rare spices and locally sourced organic ingredients, curated by our executive chef."}
                    </p>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="w-full py-4 glass border border-amber-500/20 text-amber-500 font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all duration-500 flex items-center justify-center gap-3 shadow-lg shadow-amber-500/0 hover:shadow-amber-500/10"
                    >
                      <ShoppingBag size={18} />
                      Add to Selection
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28">
              <div className="glass rounded-[2.5rem] p-10 border border-white/10 shadow-2xl overflow-hidden relative">
                {/* Decorative background for cart */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full"></div>

                <h3 className="text-2xl font-black mb-10 flex items-center gap-4 uppercase tracking-tighter">
                  <ShoppingBag size={24} className="text-amber-500" />
                  Your Selection
                </h3>

                <div className="space-y-8 max-h-[450px] overflow-y-auto pr-3 custom-scrollbar">
                  <AnimatePresence mode="popLayout">
                    {cartItems.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                      >
                        <div className="bg-white/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                          <ShoppingBag size={36} className="text-slate-700" />
                        </div>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Menu is awaiting <br />your choice</p>
                      </motion.div>
                    ) : (
                      cartItems.map((item) => (
                        <motion.div
                          key={item.dish_Id}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex items-center gap-5 group"
                        >
                          <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                            <img src={item.imageUrl || FALLBACK_MENU_IMAGE} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-black text-sm uppercase tracking-tight truncate">{item.dish_Name}</h4>
                            <p className="text-amber-500 font-black">{formatCurrency(item.dish_Price)}</p>
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            <div className="flex items-center gap-4 bg-white/5 rounded-xl border border-white/10 p-2">
                              <button onClick={() => decrementQty(item)} className="text-slate-400 hover:text-amber-500 transition-colors"><Minus size={14} /></button>
                              <span className="text-sm font-black min-w-[24px] text-center">{item.quantity}</span>
                              <button onClick={() => incrementQty(item)} className="text-slate-400 hover:text-amber-500 transition-colors"><Plus size={14} /></button>
                            </div>
                            <button onClick={() => handleRemoveFromCart(item)} className="text-slate-700 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>

                {cartItems.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-10 pt-10 border-t border-white/5 space-y-6"
                  >
                    <div className="space-y-4 mb-8">
                      <div className="relative group">
                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                        <input
                          type="text"
                          placeholder="Guest Name"
                          className="w-full glass-card bg-transparent border-white/5 pl-12 pr-4 py-4 rounded-2xl outline-none focus:border-amber-500/30 transition-all font-bold text-sm"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                        />
                      </div>
                      <div className="relative group">
                        <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                        <input
                          type="text"
                          placeholder="Table Designation (e.g. VIP-01)"
                          className="w-full glass-card bg-transparent border-white/5 pl-12 pr-4 py-4 rounded-2xl outline-none focus:border-amber-500/30 transition-all font-bold text-sm"
                          value={Table}
                          onChange={(e) => setTable(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-3 mb-10 bg-white/[0.02] p-6 rounded-[2rem] border border-white/5">
                      <div className="flex justify-between text-slate-400 text-sm font-medium">
                        <span>Subtotal</span>
                        <span>{formatCurrency(totalCost)}</span>
                      </div>
                      <div className="flex justify-between text-slate-400 text-sm font-medium">
                        <span>Service Tax (5%)</span>
                        <span>{formatCurrency(totalCost * 0.05)}</span>
                      </div>
                      <div className="pt-3 flex justify-between text-white text-2xl font-black">
                        <span>Total</span>
                        <span className="text-amber-500">{formatCurrency(totalCost * 1.05)}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleSubmitOrder}
                      className="w-full btn-primary py-5 text-lg font-black uppercase tracking-[0.2em]"
                    >
                      <CreditCard size={20} />
                      Complete Order
                    </button>
                    <p className="text-[10px] text-center text-slate-600 uppercase tracking-widest mt-6 font-bold">Encrypted Checkout & Secure Payments</p>
                  </motion.div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer Placeholder/Call to action */}
      <section className="bg-slate-950 border-t border-white/5 py-32 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-amber-500/5 blur-[120px] rounded-full"></div>
        <div className="relative z-10">
          <h2 className="text-5xl font-black mb-6 uppercase tracking-tight">Ready for a <span className="text-amber-500">Masterpiece?</span></h2>
          <p className="text-slate-400 mb-10 text-xl max-w-2xl mx-auto font-medium leading-relaxed">Join us for an unforgettable evening of culinary excellence and impeccable service.</p>
          <button className="btn-outline border-amber-500/50 text-amber-500 px-12 py-5 text-lg font-black uppercase tracking-widest hover:bg-amber-500 hover:text-black">Request a Table</button>
        </div>
      </section>
    </div>
  );
}

export default Home;
