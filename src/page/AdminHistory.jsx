import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import {
    History,
    IndianRupee,
    Calendar,
    ChevronLeft,
    Search,
    Download
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../comp/Navbar";

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

export default function AdminHistory() {
    const [history, setHistory] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

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

    const totalRevenue = history.reduce((sum, order) => sum + Number(order.totalCost || 0), 0);

    const filteredHistory = history
        .filter(order =>
            order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.Table?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .reverse();

    return (
        <div className="min-h-screen pt-24 bg-slate-950 px-4 md:px-8 pb-12">
            <Navbar />

            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <button
                            onClick={() => navigate('/admin')}
                            className="flex items-center gap-2 text-amber-500 font-black mb-4 hover:gap-3 transition-all uppercase text-[10px] tracking-widest"
                        >
                            <ChevronLeft size={16} />
                            Back to Executive HQ
                        </button>
                        <span className="text-xs font-black text-amber-500 uppercase tracking-[0.4em]">Business Records</span>
                        <h1 className="text-5xl font-black text-white mt-2 uppercase tracking-tighter">Order <span className="text-amber-500">Archives</span></h1>
                    </div>

                    <div className="flex flex-col items-end gap-2 bg-white/[0.02] border border-white/5 p-6 rounded-[2rem]">
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Total Revenue Accrued</p>
                        <div className="flex items-center gap-3">
                            <IndianRupee className="text-emerald-400" size={24} />
                            <h2 className="text-4xl font-black text-white">{formatCurrency(totalRevenue)}</h2>
                        </div>
                    </div>
                </header>

                {/* Stats & Search */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
                    <div className="lg:col-span-8">
                        <div className="relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search archives by guest name or table number..."
                                className="w-full bg-white/[0.02] border border-white/5 rounded-[1.5rem] py-6 pl-16 pr-6 text-white outline-none focus:border-amber-500/30 transition-all font-bold group-hover:bg-white/[0.04]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="lg:col-span-4 flex gap-4">
                        <div className="flex-1 glass p-6 flex items-center justify-between rounded-[1.5rem] border border-white/5">
                            <div>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Audited</p>
                                <p className="text-2xl font-black text-white">{history.length}</p>
                            </div>
                            <History className="text-amber-500/20" size={32} />
                        </div>
                        <button className="glass hover:bg-white/5 transition-all p-6 flex items-center justify-center rounded-[1.5rem] border border-white/5 group">
                            <Download className="text-slate-400 group-hover:text-amber-500 transition-colors" />
                        </button>
                    </div>
                </div>

                {/* Archives Table */}
                <div className="glass-card overflow-hidden border-white/5 shadow-2xl rounded-[2.5rem]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-slate-500 text-[10px] uppercase tracking-[0.3em] border-b border-white/5 bg-white/[0.01]">
                                    <th className="px-10 py-8 font-black">Settlement Date</th>
                                    <th className="px-10 py-8 font-black">Location (Table)</th>
                                    <th className="px-10 py-8 font-black">Primary Guest</th>
                                    <th className="px-10 py-8 font-black">Service Details</th>
                                    <th className="px-10 py-8 font-black text-right">Transaction Magnitude</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredHistory.map((order) => (
                                    <tr key={order.key} className="hover:bg-amber-500/[0.02] transition-colors group">
                                        <td className="px-10 py-10 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-white/5 p-3 rounded-xl text-amber-500">
                                                    <Calendar size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-white text-sm font-black uppercase tracking-tight">
                                                        {new Date(order.deliveredAt).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">
                                                        {new Date(order.deliveredAt).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-10">
                                            <span className="bg-white/5 text-amber-500 px-4 py-2 rounded-xl font-black text-xs border border-white/10 italic">
                                                {order.Table || 'WALK-IN'}
                                            </span>
                                        </td>
                                        <td className="px-10 py-10 font-black text-white text-lg tracking-tight uppercase">{order.customerName}</td>
                                        <td className="px-10 py-10">
                                            <div className="flex flex-col gap-2">
                                                {(order.menuItems || []).map((item, i) => (
                                                    <div key={i} className="text-[11px] text-slate-400 font-bold uppercase flex items-center gap-3">
                                                        <span className="bg-white/5 px-2 py-0.5 rounded text-amber-500/50 font-black">x{item.quantity}</span>
                                                        <span className="truncate max-w-[180px] tracking-tight">{item.dish_Name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-10 py-10 text-right">
                                            <p className="text-2xl font-black text-white mb-1">{formatCurrency(order.totalCost)}</p>
                                            <p className="text-[9px] text-emerald-500 font-black uppercase tracking-[0.2em] bg-emerald-500/5 inline-block px-3 py-1 rounded-full border border-emerald-500/10">Settled via Stripe</p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredHistory.length === 0 && (
                        <div className="py-32 text-center bg-white/[0.01]">
                            <History className="mx-auto text-slate-800 mb-8 opacity-20" size={80} />
                            <p className="text-slate-600 font-black text-xs uppercase tracking-[0.5em]">No archival records found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
