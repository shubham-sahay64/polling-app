import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db, auth } from "../firebaseConfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import "../styles/Home.css";

const fetchPolls = async (setPolls, setLoading, setError) => {
    console.log("Fetching polls from Firestore...");

    try {
        const querySnapshot = await getDocs(collection(db, "polls"));

        if (querySnapshot.empty) {
            console.warn("No polls found in Firestore.");
        }

        const pollsList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        console.log("Fetched Polls:", pollsList);
        setPolls(pollsList);
    } catch (err) {
        console.error("Error fetching polls:", err);
        setError("Failed to load polls.");
    } finally {
        setLoading(false);
    }
};

function Home() {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const user = auth.currentUser; // ✅ Get logged-in user

    useEffect(() => {
        fetchPolls(setPolls, setLoading, setError); // Fetch on page load
    }, []);

    // ✅ Handle Poll Deletion (Only for Creators)
    const handleDeletePoll = async (pollId) => {
        if (window.confirm("Are you sure you want to delete this poll?")) {
            try {
                await deleteDoc(doc(db, "polls", pollId));
                setPolls((prevPolls) => prevPolls.filter(poll => poll.id !== pollId)); // ✅ UI update optimization
                console.log("Poll deleted successfully");
            } catch (error) {
                console.error("Error deleting poll:", error);
            }
        }
    };

    // ✅ Handle Copy Poll Link (Updated for Firebase Hosting)
    const handleCopyLink = (pollId) => {
        const firebaseLink = `https://your-firebase-app.web.app/vote/${pollId}`; // ✅ Updated to use Firebase Hosting
        navigator.clipboard.writeText(firebaseLink)
            .then(() => alert("Poll link copied: " + firebaseLink))
            .catch((err) => console.error("Failed to copy link:", err));
    };

    return (
        <div className="home-container">
            <h1>Available Polls</h1>
            <Link to="/create">
                <button className="create-btn">Create a Poll</button>
            </Link>

            {loading ? <p>Loading polls...</p> : error ? (
                <p className="error">{error}</p>
            ) : polls.length === 0 ? (
                <p>No polls available. Create one!</p>
            ) : (
                <ul className="poll-list">
                    {polls.map(poll => (
                        <li key={poll.id} className="poll-item">
                            <Link to={`/vote/${poll.id}`} className="poll-link">
                                {poll.question}
                            </Link>
                            <button onClick={() => handleCopyLink(poll.id)} className="copy-link-btn">
                                Copy Link
                            </button>
                            {user?.uid === poll.createdBy && (
                                <button onClick={() => handleDeletePoll(poll.id)} className="delete-btn">
                                    Delete
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Home;
