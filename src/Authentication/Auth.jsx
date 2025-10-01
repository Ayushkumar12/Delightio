import '../asserts/style/auth.css';
import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database"; // Use set instead of push
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
const auth = getAuth(app); // Initialize Firebase Authentication
const database = getDatabase(app); // Initialize Firebase Database

const Auth = () => {
    const [activeTab, setActiveTab] = useState('login');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Corrected useNavigate initialization
  
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setEmail("");
            setPassword("");
            setError("");
            await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                sessionStorage.setItem("Auth Token", user.refreshToken);
            })
            .catch((error) => {
                console.error("Error signing in:", error);
            });
            alert("Login successful!");
            navigate('/admin');
        } catch (error) {
            setError(error.message);
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            if (!displayName || !email) {
                alert("Please enter name and email");
                return;
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                const userRef = ref(database, `Users/${user.uid}`);
                await set(userRef, {
                    displayName,
                    email,
                });
                setEmail("");
                setPassword("");
                alert("User registered successfully");
                navigate('/admin'); // Navigate to the admin page after successful signup
            }
        } catch (error) {
            setError(getErrorMessage(error.code)); // Handle error
        } finally {
            setLoading(false);
        }
    };

    const getErrorMessage = (code) => {
        switch (code) {
            case 'auth/email-already-in-use':
                return "This email address is already in use.";
            case 'auth/invalid-email':
                return "The email address is not valid.";
            case 'auth/weak-password':
                return "The password is too weak.";
            default:
                return "An unexpected error occurred. Please try again.";
        }
    };

    return (
        <div className="body">
            <div className="container">
                <div className="form-container">
                    <div className="tabs">
                        <div 
                            className={`tab ${activeTab === 'login' ? 'active' : ''}`} 
                            onClick={() => handleTabClick('login')}
                        >
                            Login
                        </div>
                        <div 
                            className={`tab ${activeTab === 'signup' ? 'active' : ''}`} 
                            onClick={() => handleTabClick('signup')}
                        >
                            Sign Up
                        </div>
                    </div>

                    {/* Login Form */}
                    <form id="login-form" className={`form ${activeTab === 'login' ? 'active' : ''}`} onSubmit={handleLogin}>
                        <h2 className="form-title">Welcome Back</h2>
                        <div className="form-group">
                            <label htmlFor="login-email">Email</label>
                            <input type="email" id="login-email" className="form-control" placeholder="Enter your email" value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="login-password">Password</label>
                            <input type="password" id="login-password" className="form-control" placeholder="Enter your password" value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required />
                        </div>
                        <button type="submit" className="btn">Login</button>
                        {error && <p style={{ color: "red" }}>{error}</p>}

                    </form>

                    {/* Signup Form */}
                    <form id="signup-form" className={`form ${activeTab === 'signup' ? 'active' : ''}`} onSubmit={handleSignup}>
                        <h2 className="form-title">Create Account</h2>
                        <div className="form-group">
                            <label htmlFor="signup-name">Full Name</label>
                            <input type="text" id="signup-name" className="form-control" placeholder="Enter your full name" value={displayName}
                                onChange={(e) => setName(e.target.value)}
                                required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="signup-email">Email</label>
                            <input type="email" id="signup-email" className="form-control" placeholder="Enter your email" value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="signup-password">Password</label>
                            <input type="password" id="signup-password" className="form-control" placeholder="Create a password" value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required />
                        </div>
                        <button type="submit" className="btn" disabled={loading}>Sign Up</button>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Auth;
