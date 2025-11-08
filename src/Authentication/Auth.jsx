import '../asserts/style/auth.css';
import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

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

// Initialize Firebase
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
        setError("");
        setEmail("");
        setPassword("");
        alert("Login successful!");
        navigate('/admin');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        const normalizedEmail = email.trim().toLowerCase();
        if (normalizedEmail !== ADMIN_EMAIL) {
            setError("Unauthorized access");
            return;
        }
        if (password !== ADMIN_PASSWORD) {
            setError("Invalid credentials.");
            return;
        }
        setLoading(true);
        try {
            const methods = await fetchSignInMethodsForEmail(auth, normalizedEmail);
            if (methods.length === 0) {
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    normalizedEmail,
                    ADMIN_PASSWORD
                );
                handleAuthSuccess(userCredential);
                return;
            }
            const userCredential = await signInWithEmailAndPassword(
                auth,
                normalizedEmail,
                ADMIN_PASSWORD
            );
            handleAuthSuccess(userCredential);
        } catch (error) {
            setError(getErrorMessage(error.code));
        } finally {
            setLoading(false);
        }
    };

    const getErrorMessage = (code) => {
        switch (code) {
            case 'auth/invalid-email':
                return "The email address is not valid.";
            case 'auth/operation-not-allowed':
                return "Enable Email/Password sign-in in Firebase.";
            case 'auth/wrong-password':
                return "Invalid credentials.";
            case 'auth/user-not-found':
                return "Admin account not found.";
            case 'auth/too-many-requests':
                return "Too many attempts. Try again later.";
            case 'auth/network-request-failed':
                return "Network error. Check your connection.";
            default:
                return "An unexpected error occurred. Please try again.";
        }
    };

    return (
        <div className="body">
            <div className="container">
                <div className="form-container">
                    <h2 className="form-title">Admin Login</h2>
                    <form className="form active" onSubmit={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="login-email">Email</label>
                            <input
                                type="email"
                                id="login-email"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="login-password">Password</label>
                            <input
                                type="password"
                                id="login-password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? "Signing In..." : "Login"}
                        </button>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Auth;
