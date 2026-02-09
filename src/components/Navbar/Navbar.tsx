import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Navbar.css'

export default function Navbar() {
    const [userName, setUserName] = useState("");
    const navigate = useNavigate();

    const checkUser = () => {
        const userData = localStorage.getItem("user")
        if (userData) {
            const user = JSON.parse(userData);
            setUserName(user.firstName);
        }
    }

    useEffect(() => {
        checkUser();
        window.addEventListener("storage", checkUser);
        return () => window.removeEventListener("storage", checkUser);
    }, [])
    const handleLogout = () => {
        localStorage.removeItem("user");
        setUserName("");
        navigate("/Connection");
    };
    return (
        <nav className="navbar-container">
            <div className="logo" onClick={() => navigate("/")}>
                🚗 רכב בקליק
            </div>

            <div className="nav-links">
                {userName ? (
                    <div className="user-info">
                        <span className="welcome-msg">שלום, **{userName}**</span>
                        <button className="logout-btn" onClick={handleLogout}>התנתק</button>
                    </div>
                ) : (

                    <button className="login-btn" onClick={() => navigate("/Connection")}>
                        התחברות
                    </button>
                )}
            </div>
        </nav>
    );
} 