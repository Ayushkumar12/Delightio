import React from "react";
import { motion } from "framer-motion";
import { ChefHat, Leaf, Globe, Award, Heart, Users } from "lucide-react";
import Navbar from "../comp/Navbar";

const About = () => {
  const values = [
    { icon: <ChefHat className="text-amber-500" />, title: "Culinary Mastery", desc: "Our chefs blend decades of tradition with avant-garde techniques to create edible art." },
    { icon: <Leaf className="text-emerald-500" />, title: "Sustainable Sourcing", desc: "We partner exclusively with local artisans and sustainable farms within a 50-mile radius." },
    { icon: <Globe className="text-blue-500" />, title: "Global Fusion", desc: "A curated journey through the world's finest flavors, reimagined for the modern palate." },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[65vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1550966841-3ee3ad3ae3f6?auto=format&fit=crop&q=80&w=2000"
            className="w-full h-full object-cover opacity-20 grayscale"
            alt="About Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
        </div>
        <div className="relative z-10 text-center max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs font-black text-amber-500 uppercase tracking-[0.6em] mb-6 block">Our Heritage</span>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 uppercase tracking-tighter">Beyond <span className="text-amber-500">Dining.</span></h1>
            <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto italic">"A legacy of flavor, a future of innovation."</p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-24 items-center mb-40">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <h2 className="text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tighter uppercase">Curating <br /><span className="text-amber-500">Excellence.</span></h2>
            <p className="text-xl text-slate-400 font-medium leading-relaxed">
              Established with a vision to redefine the culinary landscape, Delightio is more than a restaurant—it's a sanctuary for the senses. We believe every meal should be a narrative, told through the finest ingredients and boundless creativity.
            </p>
            <p className="text-lg text-slate-500 leading-relaxed font-medium">
              From our humble beginnings as a boutique kitchen, we've evolved into a beacon of modern gastronomy, where traditional techniques are honored while pushing the boundaries of what's possible on a plate.
            </p>
            <div className="flex gap-16 pt-6">
              <div className="text-left border-l-2 border-amber-500/20 pl-6">
                <p className="text-5xl font-black text-white">50K+</p>
                <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mt-3">Gourmet Feasts</p>
              </div>
              <div className="text-left border-l-2 border-amber-500/20 pl-6">
                <p className="text-5xl font-black text-white">12</p>
                <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mt-3">Master Chefs</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-10 bg-amber-500/5 blur-[120px] rounded-full"></div>
            <div className="relative glass p-3 rounded-[3rem] border-white/10 rotate-2 shadow-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1000"
                className="rounded-[2.5rem] grayscale hover:grayscale-0 transition-all duration-1000"
                alt="Atmosphere"
              />
            </div>
          </motion.div>
        </div>

        {/* Values Section */}
        <section className="py-20">
          <div className="text-center mb-24">
            <span className="text-xs font-black text-amber-500 uppercase tracking-[0.4em] mb-4 block">The Pillars of Delightio</span>
            <h2 className="text-5xl font-black uppercase tracking-tight">Our Core Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="glass-card p-12 group hover:border-amber-500/30 transition-all"
              >
                <div className="bg-white/5 w-20 h-20 rounded-[2rem] flex items-center justify-center mb-10 border border-white/5 group-hover:bg-amber-500 transition-all duration-500 group-hover:rotate-[360deg]">
                  {React.cloneElement(v.icon, { size: 36, className: "group-hover:text-black transition-colors" })}
                </div>
                <h3 className="text-3xl font-black mb-6 uppercase tracking-tight">{v.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed text-lg italic">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="mt-40 bg-white/[0.02] rounded-[4rem] p-16 md:p-24 border border-white/5 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
          <h2 className="text-5xl font-black mb-20 uppercase tracking-tighter">Our Philosophy</h2>
          <div className="grid md:grid-cols-3 gap-16">
            <div className="space-y-6">
              <div className="bg-red-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
                <Heart size={40} className="text-red-500" />
              </div>
              <h4 className="text-2xl font-black uppercase tracking-widest">Unbridled Passion</h4>
              <p className="text-slate-500 font-medium leading-relaxed">Every detail, from the acoustics of our dining room to the final garnish, is considered with unwavering love and dedication.</p>
            </div>
            <div className="space-y-6">
              <div className="bg-blue-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
                <Users size={40} className="text-blue-500" />
              </div>
              <h4 className="text-2xl font-black uppercase tracking-widest">Shared Community</h4>
              <p className="text-slate-500 font-medium leading-relaxed">We foster deep connections with our guests, staff, and local artisans, believing that great food is best enjoyed in good company.</p>
            </div>
            <div className="space-y-6">
              <div className="bg-amber-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
                <Award size={40} className="text-amber-500" />
              </div>
              <h4 className="text-2xl font-black uppercase tracking-widest">Relentless Pursuit</h4>
              <p className="text-slate-500 font-medium leading-relaxed">We settle for nothing less than culinary perfection, constantly innovating and refining our craft to surprise and delight.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 text-center border-t border-white/5">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600">Delightio © 2024 • THE PINNACLE OF FINE DINING</p>
      </footer>
    </div>
  );
};

export default About;
