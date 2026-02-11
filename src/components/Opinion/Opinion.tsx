import React, { useEffect, useState } from 'react';
import axios from 'axios';
import type {opinion} from '../Models/opinion';

interface opinionProps{
 idCar: string;
}
 
const Opinion: React.FC<opinionProps> = ({idCar}) => {
const [opinions, setOpinions] = useState<opinion[]>([]);
    const [editingId, setEditingId] = useState<string | null> (null);
    const [editComment, setEditComment] = useState("");
let currentUserId: string | null = null;

try {
  const userRaw = localStorage.getItem("user");
  if (userRaw) {
    currentUserId = JSON.parse(userRaw).id;
  }
} catch (e) {
  console.error("שגיאה בפענוח user מה־localStorage", e);
}
//     const userRaw = localStorage.getItem("user")//!!!!!!!!!!!!!!!
// const currentUserId = userRaw ? JSON.parse(userRaw).id : null;

    useEffect(() => {
        axios.get(`http://localhost:3000/Opinion?idCar=${idCar}`)
        .then(res => setOpinions(res.data))
        .catch(err => console.error("שגיאה בטעינת חוות דעת:",err));
    }, [idCar]);

    const handleUpdate = (opinionId: string) => {
axios.patch(`http://localhost:3000/Opinion/${opinionId}`, { comment: editComment }) 
    .then(() => {
        setOpinions(opinions.map(r => r.id === opinionId ? { ...r, comment: editComment } : r));
        setEditingId(null);
        alert("חוות הדעת עודכנה בהצלחה");
    })
    .catch(err => console.error("שגיאה בעדכון:", err));
};

return (
        <div className="container mt-5 p-4 border rounded bg-white shadow-sm text-end" dir="rtl">
            <h4 className="mb-4 fw-bold text-primary">חוות דעת על הרכב</h4>
            
            {opinions.length === 0 ? <p className="text-muted">אין חוות דעת לרכב זה.</p> : (
                <div className="list-group">
                    {opinions.map(review => (
                        <div key={review.id} className="list-group-item mb-3 border-0 border-bottom">
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="badge bg-light text-dark">משתמש: {review.idUser}</span>
                            </div>

                            {editingId === review.id ? (
                                <div className="mt-2">
                                    <textarea 
                                        className="form-control mb-2" 
                                        value={editComment} 
                                        onChange={(e) => setEditComment(e.target.value)}
                                    />
                                    <button className="btn btn-success btn-sm ms-2" onClick={() => handleUpdate(review.id)}>שמור שינויים</button>
                                    <button className="btn btn-outline-secondary btn-sm" onClick={() => setEditingId(null)}>ביטול</button>
                                </div>
                            ) : (
                                <p className="mt-3 fs-5">{review.comment}</p>
                            )}

                            {/* בדיקת הרשאת עריכה: רק אם ה-idUser מהלוקאל תואם לזה של התגובה */}
                            {currentUserId === review.idUser && editingId !== review.id && (
                                <button 
                                    className="btn btn-link btn-sm p-0 text-decoration-none" 
                                    onClick={() => {
                                        setEditingId(review.id);
                                        setEditComment(review.comment);
                                    }}
                                >
                                    ✏️ ערוך את התגובה שלך
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Opinion;