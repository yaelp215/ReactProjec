

import "./Addopinion.css"
import React, { useState } from 'react';
import axios from "axios";
interface AddOpinionProps {
    idCar: string;
    onClose: () => void;
    onSaved: () => void;
}

const AddOpinion: React.FC<AddOpinionProps> = ({ idCar, onClose, onSaved }) => {
    const [newComment, setNewComment] = useState("");

    const handleSaveOpinion = async () => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser || !newComment.trim()) return;
        const currentUser = JSON.parse(storedUser);
        const newOpinion = {
            id: Math.random().toString(36).substr(2, 9),
            idCar: idCar,
            idUser: currentUser.id,
            comment: newComment
        };

      await axios.post('http://localhost:3000/Opinion', newOpinion);
            setNewComment("");
            onSaved();
            onClose(); 
        
    };

    return (
        <div className="opinion-modal-overlay" onClick={onClose}>
    
            <div className="opinion-modal-card" onClick={e => e.stopPropagation()}>
                
                <h4 className="modal-title">הוספת חוות דעת</h4>
                
                <textarea 
                    className="opinion-input" 
                    rows={4} 
                    value={newComment} 
                    onChange={e => setNewComment(e.target.value)} 
                    placeholder="כתוב כאן את חוות דעתך..." 
                    dir="rtl" 
                />
                <button className="submit-btn" onClick={handleSaveOpinion}>
                    שלח
                </button>
            </div>
        </div>
    );
};

export default AddOpinion;