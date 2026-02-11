import React, { useState } from 'react';

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

        const response = await fetch('http://localhost:3000/Opinion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newOpinion)
        });

        if (response.ok) {
            setNewComment("");
            onSaved();
        }
    };

    return (
        <div className="opinion-modal-overlay" onClick={onClose}>
            <div className="opinion-modal-content p-4 shadow bg-white rounded" onClick={e => e.stopPropagation()}>
                <textarea 
                    className="form-control mb-3" 
                    rows={3} 
                    value={newComment} 
                    onChange={e => setNewComment(e.target.value)} 
                    placeholder="כתוב כאן..." 
                    dir="rtl" 
                />
                <button className="btn btn-success w-100" onClick={handleSaveOpinion}>שמור חוות דעת</button>
            </div>
        </div>
    );
};

export default AddOpinion;