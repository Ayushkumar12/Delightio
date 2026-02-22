import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ChevronLeft, ShieldCheck, AlertCircle } from 'lucide-react';
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
const auth = getAuth(app);
const ADMIN_EMAIL = (process.env.REACT_APP_ADMIN_EMAIL || "admin@delightio.com").toLowerCase();
const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || "delightio-admin";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAuthSuccess = (userCredential) => {
        const { user } = userCredential;
        sessionStorage.setItem("Auth Token", user.refreshToken);
        navigate('/admin');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        const normalizedEmail = email.trim().toLowerCase();

        if (normalizedEmail !== ADMIN_EMAIL) {
            setError("Unauthorized access. Admin only.");
            return;
        }

        setLoading(true);
        try {
            // Attempt to sign in directly
            try {
                const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, ADMIN_PASSWORD);
                handleAuthSuccess(userCredential);
            } catch (signInError) {
                // If user doesn't exist, try to create it (first time setup)
                if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/invalid-credential') {
                    try {
                        const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, ADMIN_PASSWORD);
                        handleAuthSuccess(userCredential);
                    } catch (signUpError) {
                        throw signUpError;
                    }
                } else {
                    throw signInError;
                }
            }
        } catch (error) {
            console.error("Auth Error:", error);
            setError("Invalid credentials or access denied.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 bg-slate-950">
            <Navbar />

            {/* Background elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full"
            >
                <div className="glass rounded-3xl border border-white/10 shadow-2xl p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                        <ShieldCheck className="text-amber-500/30" size={40} />
                    </div>

                    <div className="mb-8">
                        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-bold mb-6">
                            <ChevronLeft size={16} />
                            Back to Menu
                        </button>
                        <h2 className="text-4xl font-black mb-2 tracking-tight">Console Login</h2>
                        <p className="text-slate-400 font-medium">Access the Delightio command center.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Email Address</label>
                            <div className="flex items-center gap-3 glass-card px-4 py-4 border-white/5 focus-within:border-amber-500/50 transition-colors">
                                < Mail className="text-slate-500" size={20} />
                                <input
                                    type="email"
                                    placeholder="admin@delightio.com"
                                    className="bg-transparent border-none outline-none text-white w-full font-medium"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Security Key</label>
                            <div className="flex items-center gap-3 glass-card px-4 py-4 border-white/5 focus-within:border-amber-500/50 transition-colors">
                                <Lock className="text-slate-500" size={20} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="bg-transparent border-none outline-none text-white w-full font-medium"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20 text-sm font-bold"
                            >
                                <AlertCircle size={18} />
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full btn-primary py-4 text-lg shadow-amber-500/20 shadow-xl ${loading ? 'opacity-50' : ''}`}
                        >
                            {loading ? "Authenticating..." : "Establish Secure Session"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-[10px] text-slate-600 uppercase tracking-[0.2em] font-black">
                        Authorized Personnel Only
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;
