import React, { useEffect, useState } from 'react';
import axios from 'axios';
import type { opinion } from '../Models/opinion';

interface opinionProps {
    idCar: string;
}

const Opinion: React.FC<opinionProps> = ({ idCar }) => {
    const [opinions, setOpinions] = useState<opinion[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editComment, setEditComment] = useState("");
    let currentUserId: string | null = null;

    try {
        const userRaw = localStorage.getItem("user");
        if (userRaw) {
            currentUserId = JSON.parse(userRaw).id;
        }
    } catch (e) {
        console.error("שגיאה בפענוח user", e);
    }

    useEffect(() => {
        axios.get(`http://localhost:3000/Opinion?idCar=${idCar}`)
            .then(res => setOpinions(res.data))
            .catch(err => console.error("שגיאה בטעינת חוות דעת:", err));
    }, [idCar]);

    const handleUpdate = (opinionId: string) => {
        axios.patch(`http://localhost:3000/Opinion/${opinionId}`, { comment: editComment })
            .then(() => {
                setOpinions(opinions.map(r => r.id === opinionId ? { ...r, comment: editComment } : r));
                setEditingId(null);
            })
            .catch(err => console.error("שגיאה בעדכון:", err));
    };

    return (
        <div className="p-3 border rounded bg-white shadow-sm" dir="rtl">
            <h6 className="fw-bold mb-3" style={{ color: '#333' }}>חוות דעת על הרכב</h6>

            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {opinions.length === 0 ? (
                    <p className="text-muted small">אין חוות דעת לרכב זה.</p>
                ) : (
                    opinions.map(review => (
                        <div 
                            key={review.id} 
                            className="p-2 mb-1 border rounded bg-light d-flex align-items-start"
                            style={{ fontSize: '0.95rem', borderLeft: '3px solid #0d6efd' }} // פס כחול עדין בצד מוסיף טאץ' עיצובי
                        >
                            <div className="flex-grow-1">
                                {editingId === review.id ? (
                                    <div className="d-flex flex-column gap-2">
                                        <textarea 
                                            className="form-control form-control-sm" 
                                            value={editComment} 
                                            onChange={(e) => setEditComment(e.target.value)}
                                        />
                                        <div className="d-flex gap-2">
                                            <button className="btn btn-success btn-sm" onClick={() => handleUpdate(review.id)}>שמור</button>
                                            <button className="btn btn-outline-secondary btn-sm" onClick={() => setEditingId(null)}>ביטול</button>
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-dark" style={{ lineHeight: '1.4' }}>
                                        {review.comment}
                                    </span>
                                )}
                            </div>
                            {currentUserId === review.idUser && editingId !== review.id && (
                                <button 
                                    className="btn btn-link p-0 ms-2 text-muted" 
                                    style={{ fontSize: '1rem' }}
                                    onClick={() => {
                                        setEditingId(review.id);
                                        setEditComment(review.comment);
                                    }}
                                >
                                    ✏️
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Opinion;