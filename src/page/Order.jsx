import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, remove, push } from "firebase/database";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Clock, CheckCircle2 } from "lucide-react";
import Navbar from "../comp/Navbar";
import Footer from "../comp/Footer";

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

const formatCurrency = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
}).format(Number(value) || 0);

export default function Order() {
  const [orders, setOrders] = useState([]);

  const handleDeleteOrder = async (order) => {
    try {
      const historyRef = ref(database, "orderHistory");
      await push(historyRef, {
        ...order,
        deliveredAt: Date.now(),
        status: "DELIVERED"
      });
      await remove(ref(database, `orders/${order.key}`));
      alert("Order delivered and archived.");
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  useEffect(() => {
    const orderRef = ref(database, "orders");
    onValue(orderRef, (data) => {
      if (data.exists()) {
        setOrders(Object.entries(data.val()).map(([key, val]) => ({ key, ...val })));
      } else {
        setOrders([]);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <span className="text-xs font-black text-amber-500 uppercase tracking-[0.6em] mb-4 block">Kitchen Operations</span>
            <h1 className="text-6xl font-black text-white uppercase tracking-tighter">Live <span className="text-amber-500">Service</span></h1>
          </div>
          <div className="glass px-8 py-4 rounded-[2rem] border-white/5 flex items-center gap-4 mt-8 md:mt-0">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
            <span className="text-sm font-black text-slate-300 uppercase tracking-[0.2em]">{orders.length} ACTIVE ORDERS</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence>
            {orders.map((order, index) => (
              <motion.div
                key={order.key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-card p-10 border-white/5 flex flex-col justify-between group hover:border-amber-500/20 transition-all duration-500"
              >
                <div>
                  <div className="flex justify-between items-start mb-8">
                    <div className="bg-amber-500/10 text-amber-500 px-5 py-2 rounded-2xl font-black text-xs uppercase tracking-widest border border-amber-500/10">
                      Table {order.Table || 'WALK-IN'}
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
                      <Clock size={12} className="text-amber-500" />
                      In Queue
                    </div>
                  </div>

                  <h3 className="text-3xl font-black text-white mb-2 tracking-tight uppercase">{order.customerName}</h3>
                  <p className="text-slate-600 text-xs font-black mb-8 border-b border-white/5 pb-6 uppercase tracking-widest">ORDER #{order.key.slice(-6).toUpperCase()}</p>

                  <ul className="space-y-4 mb-10">
                    {(Array.isArray(order.menuItems) ? order.menuItems : []).map((item, idx) => (
                      <li key={idx} className="flex justify-between items-center text-slate-300 font-bold bg-white/[0.02] p-4 rounded-2xl border border-white/5 group-hover:bg-white/5 transition-colors">
                        <span className="text-sm uppercase tracking-tight">{item.dish_Name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-600 text-xs font-black">QTY</span>
                          <span className="text-amber-500 font-black text-lg">×{item.quantity}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-1">Total Amount</p>
                    <p className="text-2xl font-black text-white">{formatCurrency(order.totalCost)}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteOrder(order)}
                    className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black p-5 rounded-2xl transition-all border border-emerald-500/20 hover:scale-110 shadow-lg shadow-emerald-500/0 hover:shadow-emerald-500/10"
                    title="Mark as Delivered"
                  >
                    <CheckCircle2 size={24} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-40 bg-white/[0.01] rounded-[4rem] border border-dashed border-white/5">
            <Package size={80} className="mx-auto text-slate-800 mb-8 opacity-20" />
            <h3 className="text-3xl font-black text-slate-600 uppercase tracking-tighter">Kitchen is At Peace</h3>
            <p className="text-slate-700 font-medium mt-4 text-lg">All culinary requests have been fulfilled. Standing by for new orders.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
