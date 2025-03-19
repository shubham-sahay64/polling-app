import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { auth } from "./firebaseConfig";
import { signOut } from "firebase/auth";
import Home from "./pages/Home";
import CreatePoll from "./pages/CreatePoll";
import Vote from "./pages/Vote";
import LiveResults from "./pages/LiveResults"; // ✅ Import Live Results Page
import Login from "./pages/Login";
import Navbar from "./components/Navbar";

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // ✅ Logout function
    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log("User Logged Out");
            setUser(null);
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout Failed:", error);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <Router>
            <Navbar user={user} onLogout={handleLogout} />
            <Routes>
                <Route path="/" element={user ? <Home user={user} /> : <Navigate to="/login" />} />
                <Route path="/create" element={user ? <CreatePoll /> : <Navigate to="/login" />} />
                <Route path="/vote/:id" element={user ? <Vote /> : <Navigate to="/login" />} />
                <Route path="/live-results" element={user ? <LiveResults /> : <Navigate to="/login" />} /> {/* ✅ Add Live Results Route */}
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;
