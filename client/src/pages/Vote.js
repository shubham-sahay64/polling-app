import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebaseConfig";
import { doc, getDoc, updateDoc, collection, addDoc, onSnapshot } from "firebase/firestore";
import "../styles/Vote.css";

function Vote() {
    const { id } = useParams(); // Get poll ID from URL
    const [poll, setPoll] = useState(null);
    const [selectedOption, setSelectedOption] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [comments, setComments] = useState([]); // ✅ Store comments
    const [newComment, setNewComment] = useState(""); // ✅ Input for new comment
    const user = auth.currentUser;

    useEffect(() => {
        const fetchPoll = async () => {
            try {
                const pollRef = doc(db, "polls", id);
                const pollSnap = await getDoc(pollRef);

                if (pollSnap.exists()) {
                    setPoll(pollSnap.data());
                } else {
                    setError("Poll not found.");
                }
            } catch (error) {
                setError("Error fetching poll.");
                console.error("Error fetching poll:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPoll();

        // ✅ Real-time listener for comments
        const commentsRef = collection(db, "polls", id, "comments");
        const unsubscribe = onSnapshot(commentsRef, (snapshot) => {
            setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsubscribe();
    }, [id]);

    // ✅ Handle Voting
    const handleVote = async () => {
        if (!selectedOption || !user) {
            setError("Please select an option and log in.");
            return;
        }

        try {
            const pollRef = doc(db, "polls", id);
            const pollSnap = await getDoc(pollRef);

            if (pollSnap.exists()) {
                const pollData = pollSnap.data();

                if (pollData.votedUsers?.includes(user.uid)) {
                    setError("You have already voted in this poll.");
                    return;
                }

                const updatedOptions = pollData.options.map(option =>
                    option.text === selectedOption ? { ...option, votes: option.votes + 1 } : option
                );

                await updateDoc(pollRef, {
                    options: updatedOptions,
                    votedUsers: [...(pollData.votedUsers || []), user.uid]
                });

                setSuccess("Vote submitted successfully!");
                setError("");
            }
        } catch (error) {
            setError("Error submitting vote.");
            console.error("Error submitting vote:", error);
        }
    };

    // ✅ Handle Adding Comments
    const handleAddComment = async () => {
        if (!newComment.trim() || !user) {
            setError("Comment cannot be empty and you must be logged in.");
            return;
        }

        try {
            await addDoc(collection(db, "polls", id, "comments"), {
                text: newComment,
                user: user.displayName || "Anonymous",
                createdAt: new Date()
            });

            setNewComment(""); // ✅ Clear input after posting
        } catch (error) {
            setError("Error adding comment.");
            console.error("Error adding comment:", error);
        }
    };

    if (loading) return <p>Loading poll...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="vote-container">
            <h1>{poll?.question}</h1>
            {poll?.options.map((option, index) => (
                <label key={index} className="option">
                    <input
                        type="radio"
                        name="vote"
                        value={option.text}
                        onChange={(e) => setSelectedOption(e.target.value)}
                    />
                    {option.text} ({option.votes} votes)
                </label>
            ))}
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <button className="vote-btn" onClick={handleVote} disabled={success !== ""}>Submit Vote</button>

            {/* ✅ Comments Section */}
            <div className="comments-section">
                <h3>Discussion</h3>
                {comments.map(comment => (
                    <p key={comment.id}><strong>{comment.user}:</strong> {comment.text}</p>
                ))}

                <textarea
                    placeholder="Leave a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button onClick={handleAddComment}>Post Comment</button>
            </div>
        </div>
    );
}

export default Vote;
