import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, UtensilsCrossed, User, Info, Phone } from 'lucide-react';
import { useAuth } from '../Authentication/Authpro';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { username } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Menu', path: '/', icon: <UtensilsCrossed size={18} /> },
    { name: 'About', path: '/about', icon: <Info size={18} /> },
    { name: 'Contact', path: '/contact', icon: <Phone size={18} /> },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className={`glass rounded-2xl px-6 py-3 flex items-center justify-between border border-white/10 shadow-2xl transition-all duration-300 ${scrolled ? 'bg-slate-900/80' : 'bg-transparent'}`}>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-amber-500 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
              <UtensilsCrossed className="text-black" size={24} />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-white to-amber-500 bg-clip-text text-transparent">
              DELIGHTIO
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 text-sm font-semibold transition-colors duration-200 ${location.pathname === link.path ? 'text-amber-500' : 'text-slate-300 hover:text-white'
                  }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link to="/auth" className="hidden border-l border-slate-700 pl-6 md:flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
              <User size={18} />
              <span className="text-sm font-medium">{username || 'Admin'}</span>
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full p-4 md:hidden"
          >
            <div className="glass rounded-2xl border border-white/10 p-6 flex flex-col gap-4 shadow-2xl">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${location.pathname === link.path
                    ? 'bg-amber-500 text-black'
                    : 'text-slate-300 hover:bg-white/5'
                    }`}
                >
                  {link.icon}
                  <span className="font-bold">{link.name}</span>
                </Link>
              ))}
              <Link
                to="/auth"
                onClick={() => setIsOpen(false)}
                className="mt-4 flex items-center justify-center gap-2 p-3 border border-amber-500/30 text-amber-500 rounded-xl font-bold"
              >
                <User size={18} />
                {username || 'Admin Login'}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;