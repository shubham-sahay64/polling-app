import React, { useState } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/CreatePoll.css";

function CreatePoll() {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const user = auth.currentUser; // ✅ Get logged-in user

    const addOption = () => {
        if (options.length >= 6) {
            setError("You can add a maximum of 6 options.");
            return;
        }
        setOptions([...options, ""]);
        setError("");
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const removeOption = (index) => {
        if (options.length <= 2) {
            setError("A poll must have at least 2 options.");
            return;
        }
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
        setError("");
    };

    const createPoll = async () => {
        if (!question.trim()) {
            setError("Poll question cannot be empty.");
            return;
        }
        if (options.some(option => !option.trim())) {
            setError("All options must be filled.");
            return;
        }
        if (!user) {
            setError("You must be logged in to create a poll.");
            return;
        }

        try {
            await addDoc(collection(db, "polls"), {
                question,
                options: options.map(option => ({ text: option, votes: 0 })),
                createdBy: user.uid, // ✅ Store creator's UID
                createdAt: new Date()
            });

            navigate("/live-results"); // ✅ Redirect to Live Results after creation
        } catch (error) {
            console.error("Error creating poll:", error);
            setError("Failed to create poll.");
        }
    };

    return (
        <div className="create-poll-container">
            <h1>Create a New Poll</h1>

            <input
                type="text"
                placeholder="Enter poll question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="poll-input"
            />

            <h3>Options:</h3>
            {options.map((option, index) => (
                <div key={index} className="option-container">
                    <input
                        type="text"
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="poll-input"
                    />
                    {options.length > 2 && (
                        <button className="remove-btn" onClick={() => removeOption(index)}>X</button>
                    )}
                </div>
            ))}

            {error && <p className="error">{error}</p>}

            <button className="add-option-btn" onClick={addOption}>+ Add Option</button>
            <button className="create-btn" onClick={createPoll}>Create Poll</button>
        </div>
    );
}

export default CreatePoll;
