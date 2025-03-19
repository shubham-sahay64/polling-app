import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import "../styles/LiveResults.css";

function LiveResults() {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // ✅ Real-time listener for Firestore polls
        const unsubscribe = onSnapshot(collection(db, "polls"), (snapshot) => {
            const updatedPolls = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPolls(updatedPolls);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="live-results-container">
            <h1>Live Poll Results</h1>
            {loading ? <p>Loading polls...</p> : (
                <div>
                    {polls.length === 0 ? (
                        <p>No active polls available.</p>
                    ) : (
                        polls.map((poll) => (
                            <div key={poll.id} className="poll-item">
                                <h2>{poll.question}</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={poll.options.map(option => ({
                                        name: option.text,
                                        votes: option.votes,
                                    }))}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="votes" fill="#00c3ff" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default LiveResults;
