import React, { useState, useEffect } from "react";
import LoginForm from "../Connection/Connection"; 
import "./OpenPage.css";

export const LandingPage = ({ setIsAdmin }: { setIsAdmin: (val: boolean) => void }) => {
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
  
    const timer = setTimeout(() => {
      setShowLogin(true);
    }, 5000);

    return () => clearTimeout(timer); 
  }, []);

  return (
    <div className="landing-outer-wrapper">
 
      <div className={`landing-container ${showLogin ? 'blurred' : ''}`}>
        <div className="background-decor">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
        </div>

        <div className="hero-content">
          <h1>Welcome to Drivon</h1>
          <p>חווית הנהיגה הבאה שלך מתחילה כאן</p>
          
          <img 
            src="/Image/Logo- DRIVON.png" 
            className="floating-car" 
            alt="Car" 
          />
        </div>
      </div>

 
      {showLogin && (
        <div className="login-modal-overlay">
          <div className="pop-in">
            <LoginForm setIsAdmin={setIsAdmin} />
          </div>
        </div>
      )}
    </div>
  );
};