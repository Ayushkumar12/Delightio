import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, push, remove } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { motion } from "framer-motion";
import {
  BarChart3,
  Package,
  ShoppingCart,
  IndianRupee,
  Plus,
  Trash2,
  Upload,
  LayoutDashboard,
  ChefHat,
  Monitor,
  CheckCircle2,
  History
} from "lucide-react";
import { useAuth } from "../Authentication/Authpro";
import Navbar from "../comp/Navbar";
import { useNavigate } from "react-router-dom";

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
const storage = getStorage(app);

const formatCurrency = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
}).format(Number(value) || 0);

export default function Admin() {
  const [dish_Name, setDish_Name] = useState("");
  const [dish_Price, setDish_Price] = useState("");
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [history, setHistory] = useState([]);
  const [image, setImage] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { username } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const menuRef = ref(database, "menu");
    const unsubscribe = onValue(menuRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMenu(Object.entries(data).map(([key, val]) => ({ key, ...val })));
      } else {
        setMenu([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const ordersRef = ref(database, "orders");
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setOrders(Object.entries(data).map(([key, val]) => ({ key, ...val })));
      } else {
        setOrders([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const historyRef = ref(database, "orderHistory");
    const unsubscribe = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setHistory(Object.entries(data).map(([key, val]) => ({ key, ...val })));
      } else {
        setHistory([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAddDish = async (e) => {
    e.preventDefault();
    if (!dish_Name || !dish_Price || !image) return alert("All fields required");

    try {
      const sRef = storageRef(storage, `images/${Date.now()}_${image.name}`);
      await uploadBytes(sRef, image);
      const imageUrl = await getDownloadURL(sRef);

      const menuRef = ref(database, "menu");
      await push(menuRef, {
        dish_Name,
        dish_Price,
        imageUrl,
        dish_Id: `DISH_${Date.now()}`
      });

      setDish_Name("");
      setDish_Price("");
      setImage(null);
      e.target.reset();
      alert("Dish added across the realm!");
    } catch (err) {
      console.error(err);
      alert("Deployment failure in the kitchen.");
    }
  };

  const removeDish = async (key) => {
    if (window.confirm("Banish this dish forever?")) {
      await remove(ref(database, `menu/${key}`));
    }
  };

  const deliverOrder = async (order) => {
    if (window.confirm("Mark this order as delivered and archive it?")) {
      try {
        const historyRef = ref(database, "orderHistory");
        await push(historyRef, {
          ...order,
          deliveredAt: Date.now(),
          status: "DELIVERED"
        });
        await remove(ref(database, `orders/${order.key}`));
        alert("Order delivered and archived to history!");
      } catch (err) {
        console.error(err);
        alert("Failed to deliver order.");
      }
    }
  };

  const stats = [
    {
      label: "Total Earnings", value: formatCurrency(
        [...orders, ...history].reduce((sum, o) => sum + Number(o.totalCost || 0), 0)
      ), icon: <IndianRupee className="text-emerald-400" />, color: "bg-emerald-500/10"
    },
    { label: "Completed Orders", value: history.length, icon: <History className="text-blue-400" />, color: "bg-blue-500/10" },
    { label: "Menu Curations", value: menu.length, icon: <ChefHat className="text-amber-400" />, color: "bg-amber-500/10" },
    { label: "Live Requests", value: orders.length, icon: <ShoppingCart className="text-purple-400" />, color: "bg-purple-500/10" },
  ];

  return (
    <div className="min-h-screen pt-24 bg-slate-950 px-4 md:px-8 pb-12">
      <Navbar />

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <span className="text-xs font-black text-amber-500 uppercase tracking-[0.4em]">Administrative Suite</span>
            <h1 className="text-5xl font-black text-white mt-2 tracking-tighter uppercase">Executive <span className="text-amber-500">HQ</span></h1>
            <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest">Authorized Access: <span className="text-amber-500">@{username || 'CHEF_SUPREME'}</span></p>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={() => navigate('/admin/history')}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest bg-white/5 text-amber-500 border border-white/5 hover:bg-white/10 transition-all mr-2"
            >
              <History size={16} />
              Order Archives
            </button>
            <div className="flex gap-4 p-2 glass rounded-[1.5rem] border-white/5">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'dashboard' ? 'bg-amber-500 text-black' : 'text-slate-500 hover:text-white'}`}
              >
                <LayoutDashboard size={16} />
                Analytics
              </button>
              <button
                onClick={() => setActiveTab("management")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'management' ? 'bg-amber-500 text-black' : 'text-slate-500 hover:text-white'}`}
              >
                <Package size={16} />
                Menu Control
              </button>
            </div>
          </div>
        </header>

        {activeTab === "dashboard" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="glass-card p-8 flex items-center gap-6 border-white/5 group hover:border-amber-500/20 transition-all">
                  <div className={`${stat.color} p-5 rounded-2xl group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                    <h3 className="text-2xl font-black text-white">{stat.value}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Orders Pipeline */}
            <div className="glass-card overflow-hidden rounded-[2.5rem] border-white/5 shadow-2xl">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                <div className="flex items-center gap-4">
                  <div className="bg-amber-500/10 p-2 rounded-lg">
                    <BarChart3 className="text-amber-500" size={20} />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">Active Service Pipeline</h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Live Feed Active</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-slate-500 text-[10px] uppercase tracking-[0.3em] border-b border-white/5 bg-white/[0.01]">
                      <th className="px-10 py-6">Location (Table)</th>
                      <th className="px-10 py-6">Guest</th>
                      <th className="px-10 py-6">Selections</th>
                      <th className="px-10 py-6">Service Level</th>
                      <th className="px-10 py-6 text-right pr-20">Total Amount</th>
                      <th className="px-10 py-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[...orders].reverse().map((order) => (
                      <tr key={order.key} className="hover:bg-amber-500/[0.02] transition-colors group">
                        <td className="px-10 py-8">
                          <span className="bg-white/5 text-amber-500 px-4 py-2 rounded-xl font-black text-xs border border-white/10 italic">
                            {order.Table || 'WALK-IN'}
                          </span>
                        </td>
                        <td className="px-10 py-8 font-black text-white text-lg tracking-tight uppercase">{order.customerName}</td>
                        <td className="px-10 py-8">
                          <div className="flex flex-col gap-2">
                            {(order.menuItems || []).map((item, i) => (
                              <div key={i} className="text-[11px] text-slate-400 font-bold uppercase flex items-center gap-3">
                                <span className="bg-white/5 px-2 py-0.5 rounded text-amber-500 font-black">x{item.quantity}</span>
                                <span className="truncate max-w-[180px] tracking-tight">{item.dish_Name}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-3 text-emerald-400 font-black text-xs uppercase tracking-widest">
                            <CheckCircle2 size={14} />
                            AUTHENTICATED
                          </div>
                        </td>
                        <td className="px-10 py-8 text-right pr-20 font-black text-white text-xl">{formatCurrency(order.totalCost)}</td>
                        <td className="px-10 py-8 text-right">
                          <button
                            onClick={() => deliverOrder(order)}
                            className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black p-4 rounded-2xl transition-all border border-emerald-500/20 group-hover:scale-110 shadow-lg shadow-emerald-500/0 hover:shadow-emerald-500/20"
                            title="Complete Service"
                          >
                            <CheckCircle2 size={24} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {orders.length === 0 && (
                  <div className="py-24 text-center">
                    <Monitor size={48} className="mx-auto text-slate-800 mb-4 opacity-20" />
                    <p className="text-slate-600 font-black text-xs uppercase tracking-[0.5em]">No active requests in pipeline</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-12 gap-12"
          >
            {/* Add Dish Form */}
            <div className="lg:col-span-12 xl:col-span-4">
              <div className="glass rounded-[3rem] p-10 border border-white/10 sticky top-28 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full"></div>
                <h3 className="text-2xl font-black mb-10 flex items-center gap-4 uppercase tracking-tight">
                  <div className="bg-amber-500 p-2 rounded-xl text-black">
                    <Plus size={24} />
                  </div>
                  New Masterpiece
                </h3>
                <form onSubmit={handleAddDish} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Dish Moniker</label>
                    <input
                      type="text"
                      placeholder="Ex: Truffle Infused Risotto"
                      className="w-full glass-card bg-transparent border-white/5 p-5 rounded-2xl outline-none focus:border-amber-500/30 transition-all font-bold"
                      value={dish_Name}
                      onChange={(e) => setDish_Name(e.target.value)}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Valuation (INR)</label>
                    <input
                      type="number"
                      placeholder="Price in INR"
                      className="w-full glass-card bg-transparent border-white/5 p-5 rounded-2xl outline-none focus:border-amber-500/30 transition-all font-bold"
                      value={dish_Price}
                      onChange={(e) => setDish_Price(e.target.value)}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Dish Imagery</label>
                    <div className="relative group">
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={(e) => setImage(e.target.files[0])}
                      />
                      <div className="glass-card border-dashed border-white/10 p-10 text-center group-hover:border-amber-500/50 transition-all bg-white/[0.01] rounded-2xl">
                        <Upload className="mx-auto text-slate-600 mb-4 group-hover:text-amber-500 transition-colors" size={32} />
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
                          {image ? image.name : "Select High-Res Asset"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="w-full btn-primary py-5 text-lg font-black uppercase tracking-[0.2em] shadow-xl shadow-amber-500/0 hover:shadow-amber-500/10 mt-4">
                    Commit To Menu
                  </button>
                </form>
              </div>
            </div>

            {/* Menu Management */}
            <div className="lg:col-span-12 xl:col-span-8 space-y-10">
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                  <ChefHat className="text-amber-500" />
                  <h3 className="text-3xl font-black uppercase tracking-tight">Current Selection</h3>
                </div>
                <span className="text-[10px] font-black text-amber-500 glass px-6 py-2 rounded-full border border-amber-500/20 tracking-[0.2em]">{menu.length} ACTIVE ITEMS</span>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {menu.map((dish) => (
                  <div key={dish.key} className="glass rounded-[2rem] border border-white/5 overflow-hidden flex h-40 group hover:border-amber-500/20 transition-all duration-500 shadow-xl">
                    <div className="w-40 h-full overflow-hidden shrink-0">
                      <img src={dish.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" alt="" />
                    </div>
                    <div className="flex-1 p-6 flex flex-col justify-between bg-white/[0.01]">
                      <div>
                        <h4 className="font-black text-white text-xl leading-tight uppercase tracking-tight mb-1">{dish.dish_Name}</h4>
                        <p className="text-amber-500 font-black text-lg">{formatCurrency(dish.dish_Price)}</p>
                      </div>
                      <button
                        onClick={() => removeDish(dish.key)}
                        className="flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-red-500 transition-all uppercase tracking-widest group/btn"
                      >
                        <Trash2 size={14} className="group-hover/btn:rotate-12 transition-transform" />
                        Retire Dish
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
