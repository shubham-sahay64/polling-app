import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar({ user, onLogout }) {
    const location = useLocation();

    return (
        <nav className="navbar">
            {location.pathname === "/login" ? ( 
                <h1 className="welcome-text">WELCOME!</h1>  
            ) : (
                <>
                    <div className="nav-left">
                        <Link to="/" className="nav-logo">Polling App</Link>
                    </div>
                    <div className="nav-right">
                        <Link to="/" className="nav-link">Home</Link>
                        <Link to="/create" className="nav-link">Create Poll</Link>
                        <Link to="/live-results" className="nav-link">Live Results</Link> {/* ✅ New Link */}
                        
                        {user ? ( // ✅ Only show user info if logged in
                            <>
                                <button onClick={onLogout} className="logout-btn">Logout</button>
                                <div className="user-info">
                                    <img 
                                        src={user.photoURL || "/default-avatar.png"} // ✅ Use default avatar if null
                                        alt="Profile" 
                                        className="user-avatar" 
                                    />
                                    <span>{user.displayName || "User"}</span> {/* ✅ Default to "User" if null */}
                                </div>
                            </>
                        ) : (
                            <Link to="/login" className="nav-link">Login</Link> // ✅ Show Login if user is not logged in
                        )}
                    </div>
                </>
            )}
        </nav>
    );
}

export default Navbar;
