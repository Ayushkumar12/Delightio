import React from "react";
import { Link } from "react-router-dom";
import { UtensilsCrossed, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/5 pt-20 pb-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">

        {/* Brand */}
        <div className="md:col-span-2 space-y-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-amber-500 p-2 rounded-xl">
              <UtensilsCrossed className="text-black" size={24} />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">DELIGHTIO</span>
          </Link>
          <p className="text-slate-500 font-medium max-w-sm leading-relaxed">
            Crafting the future of dining through tradition and technology. Join us for a journey of extraordinary flavors and moments.
          </p>
          <div className="flex gap-4">
            {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
              <a key={i} href="#!" className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-slate-500 hover:bg-amber-500 hover:text-black transition-all">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Excursion</h4>
          <ul className="space-y-4">
            <li><Link to="/" className="text-slate-500 hover:text-amber-500 transition-colors font-medium">The Menu</Link></li>
            <li><Link to="/about" className="text-slate-500 hover:text-amber-500 transition-colors font-medium">Our Story</Link></li>
            <li><Link to="/contact" className="text-slate-500 hover:text-amber-500 transition-colors font-medium">Concierge</Link></li>
          </ul>
        </div>

        {/* Legal/Contact */}
        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Contact</h4>
          <ul className="space-y-4 text-slate-500 font-medium">
            <li>Aura Tower, Sector 45</li>
            <li>Gurugram, HR 122003</li>
            <li>+91 88000 11223</li>
            <li>hello@delightio.com</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:row justify-between items-center gap-4 text-slate-600 text-xs font-bold uppercase tracking-[0.2em]">
        <p>© 2024 DELIGHTIO. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8">
          <a href="#!" className="hover:text-white transition-colors">Privacy</a>
          <a href="#!" className="hover:text-white transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
}
