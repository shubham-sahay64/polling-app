import React from "react";
import { auth, provider } from "../firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
    const navigate = useNavigate();

    // Handle Google Sign-In
    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            console.log("User Logged In:", result.user);
            navigate("/"); // Redirect to homepage after login
        } catch (error) {
            console.error("Login Failed:", error);
        }
    };

    return (
        <div className="login-container">
            <h1>Login to Polling App</h1>
            <button onClick={handleLogin} className="login-btn">Sign in with Google</button>
        </div>
    );
}

export default Login;
