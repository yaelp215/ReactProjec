import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Navbar.css'
import { UserCircle, LogOut, Search , UserRoundPen } from "lucide-react";

interface NavbarProps {
    onSearchClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearchClick }) =>{
    
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
        localStorage.removeItem('isAdmin');
        setUserName("");
        navigate("/Connection");
    };
   return (
        <nav className="navbar-container">
            <div className="navbar-content">
                
                {/* צד ימין: לוגו וקישורים מהירים */}
                <div className="nav-right-section">
                    <div className="brand-logo" onClick={() => navigate("/")}>
                        <div className="logo-icon-bg">
                         <img src="/public/Image/Logo- DRIVON.png" alt="" />
                        </div>
                        <span className="brand-name">DRIVON</span>
                    </div>

                    <div className="main-nav-links">
                        <button className="nav-item-link" onClick={() => navigate("/cars")}>
                            קטלוג רכבים
                        </button>
                        <button className="nav-item-link search-trigger" onClick={onSearchClick}>
                            <Search size={18} />
                            חיפוש
                        </button>
                    </div>
                </div>

                {/* צד שמאל: פרטי משתמש */}
                <div className="nav-left-section">
                    {userName ? (
                        <div className="user-profile-zone">
                            <div className="user-welcome">
                                <span className="hello-text">שלום,</span>
                                <span className="user-name-bold">{userName}</span>
                            </div>
                            
                            <div className="action-icons">
                                <button 
                                    className="icon-action-btn" 
                                    title="עריכת פרופיל"
                                    onClick={() => navigate("/login", { state: { editMode: true } })}
                                >
                                    <UserRoundPen size={20} />
                                </button>
                                
                                <button 
                                    className="icon-action-btn logout-accent" 
                                    title="התנתק"
                                    onClick={handleLogout}
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button className="primary-login-btn" onClick={() => navigate("/Connection")}>
                            <UserCircle size={20} />
                            התחברות
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
} 
export default Navbar;