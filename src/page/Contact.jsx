import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageSquare, Clock, ArrowRight } from "lucide-react";
import Navbar from "../comp/Navbar";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "reservation",
    guests: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      alert("Message transmitted to the concierge. We will respond shortly.");
      setLoading(false);
      setFormData({ name: "", email: "", phone: "", topic: "reservation", guests: "", message: "" });
    }, 1500);
  };

  const contactMethods = [
    { icon: <Phone size={24} />, title: "Concierge", value: "+91 88000 11223", desc: "For table reservations" },
    { icon: <Mail size={24} />, title: "Inquiries", value: "hello@delightio.com", desc: "Events & partnerships" },
    { icon: <MapPin size={24} />, title: "Visit Us", value: "Aura Tower, Sector 45", desc: "Gurugram, HR 122003" },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-12 gap-16">

          {/* Left Column: Info */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="text-xs font-black text-amber-500 uppercase tracking-[0.6em] mb-6 block">Inquiries & Reservations</span>
              <h1 className="text-6xl md:text-7xl font-black text-white leading-tight mb-8 tracking-tighter uppercase">An Exclusive <br /><span className="text-amber-500">Dialogue.</span></h1>
              <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-md italic">
                From intimate candlelit dinners to grand corporate celebrations, our concierge team is dedicated to orchestrating your perfect experience.
              </p>
            </motion.div>

            <div className="space-y-10">
              {contactMethods.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-8 group"
                >
                  <div className="bg-white/5 p-5 rounded-[1.5rem] border border-white/5 text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-all duration-500 group-hover:-rotate-12">
                    {m.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">{m.title}</p>
                    <p className="text-2xl font-black text-white mb-1 tracking-tight">{m.value}</p>
                    <p className="text-sm font-medium text-slate-500 italic">{m.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="glass-card p-10 border-amber-500/10 rounded-[2.5rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full group-hover:bg-amber-500/10 transition-colors"></div>
              <div className="flex items-center gap-4 text-amber-500 mb-6">
                <Clock size={20} />
                <span className="font-black text-xs uppercase tracking-[0.3em]">Boutique Hours</span>
              </div>
              <div className="space-y-4 font-bold text-slate-300">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-xs uppercase tracking-widest text-slate-500">Weekdays</span>
                  <span className="text-white text-lg font-black">12:00 — 23:30</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase tracking-widest text-slate-500">Weekends</span>
                  <span className="text-white text-lg font-black">11:00 — 02:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-12 xl:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-[3.5rem] p-8 md:p-16 border border-white/10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                <MessageSquare size={200} />
              </div>

              <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Guest Identity</label>
                    <input
                      type="text"
                      placeholder="Ex: Alexander Sterling"
                      className="w-full glass-card bg-transparent border-white/5 p-5 rounded-2xl outline-none focus:border-amber-500/30 transition-all font-bold"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Digital Correspondence</label>
                    <input
                      type="email"
                      placeholder="sterling@delightio.com"
                      className="w-full glass-card bg-transparent border-white/5 p-5 rounded-2xl outline-none focus:border-amber-500/30 transition-all font-bold"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Nature of Request</label>
                    <div className="relative">
                      <select
                        className="w-full glass-card bg-slate-950 border-white/5 p-5 rounded-2xl outline-none focus:border-amber-500/30 transition-all font-bold appearance-none cursor-pointer"
                        value={formData.topic}
                        onChange={e => setFormData({ ...formData, topic: e.target.value })}
                      >
                        <option value="reservation">Table Reservation</option>
                        <option value="event">Private Celebration</option>
                        <option value="catering">Gourmet Catering</option>
                        <option value="feedback">Guest Experience Feedback</option>
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 font-black">
                        <ArrowRight size={14} className="rotate-90" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Party Magnitude</label>
                    <input
                      type="number"
                      placeholder="Number of esteemed guests"
                      className="w-full glass-card bg-transparent border-white/5 p-5 rounded-2xl outline-none focus:border-amber-500/30 transition-all font-bold"
                      value={formData.guests}
                      onChange={e => setFormData({ ...formData, guests: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Personal Requirements</label>
                  <textarea
                    rows="5"
                    placeholder="Describe your vision or specify any dietary requirements..."
                    className="w-full glass-card bg-transparent border-white/5 p-5 rounded-2xl outline-none focus:border-amber-500/30 transition-all font-bold resize-none leading-relaxed"
                    required
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-6 text-lg group overflow-hidden relative"
                >
                  <span className="flex items-center justify-center gap-4 relative z-10 font-black uppercase tracking-[0.2em]">
                    {loading ? "Transmitting..." : "Engage Concierge"}
                    <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform duration-500" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
