import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import type { Car } from '../Models/car';
import './CarDetails.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';



interface CarDetailsProps {
    isAdmin: boolean;
}

const CarDetails: React.FC<CarDetailsProps> = ({ isAdmin }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [car, setcar] = useState<Car>();
    const [startDate, setStartDate] = useState<number | null>(null);

    useEffect(() => {
        fetch(`http://localhost:3000/cars/${id}`)
            .then(res => res.json())
            .then(data => setcar(data))
            .catch(err => console.error("Error fetching car:", err));
    }, [id]);

    const handleDayClick = (index: number): void => {
        if (!car) return;

        // --- שלב 1: ביטול יום בודד (אם הוא כבר תפוס) ---
        if (car.availability[index] === true) {
            const updatedAvailability = [...car.availability];
            updatedAvailability[index] = false; // הופך לזמין חזרה

            // עדכון מקומי ועדכון שרת מידי
            setcar({ ...car, availability: updatedAvailability });
            setStartDate(null); // מאפסים בחירת טווח אם הייתה באמצע

            fetch(`http://localhost:3000/cars/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ availability: updatedAvailability })
            }).catch((err: Error) => console.error("שגיאה בביטול יום:", err));

            return; // יוצאים מהפונקציה ולא ממשיכים ללוגיקה של הטווח
        }

        // --- שלב 2: לוגיקת הטווחים (כמו שעשינו קודם) ---
        if (startDate === null) {
            setStartDate(index);
            const fastUpdate = [...car.availability];
            fastUpdate[index] = true;
            setcar({ ...car, availability: fastUpdate });
        } else {
            const updatedAvailability: boolean[] = [...car.availability];
            const start = Math.min(startDate, index);
            const end = Math.max(startDate, index);

            for (let i = start; i <= end; i++) {
                updatedAvailability[i] = true;
            }

            setcar({ ...car, availability: updatedAvailability });

            fetch(`http://localhost:3000/cars/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ availability: updatedAvailability })
            })
                .then((res: Response) => {
                    if (res.ok) setStartDate(null);
                })
                .catch((err: Error) => console.error("שגיאה בעדכון טווח:", err));
        }
       };
const handleDeleteCar = () => {
    if (window.confirm("האם את בטוחה שברצונך למחוק את הרכב הזה לצמיתות?")) {
        fetch(`http://localhost:3000/cars/${id}`, {
            method: 'DELETE',
        })
        .then(res => {
            if (res.ok) {
                alert("הרכב נמחק בהצלחה");
                navigate("/"); // חזרה לדף הבית אחרי המחיקה
            } else {
                alert("שגיאה בניסיון המחיקה");
            }
        })
        .catch(err => console.error("Error deleting car:", err));
    }
};
    
    if (!car) return <div>טוען נתונים...</div>;

    return (
<div className="car-details-page">
            {isAdmin && (
            <div className="container mt-3 d-flex gap-2"> 
                <button 
                    className="btn btn-warning shadow-sm fw-bold" 
                    onClick={() => navigate(`/AddNewCar`)} 
                >
                    ✏️ עריכת פרטי רכב
                </button>
                
                <button 
                    className="btn btn-danger shadow-sm fw-bold" 
                    onClick={handleDeleteCar}
                >
                    🗑️ מחיקת רכב
                </button>
            </div>
        )}
                <div className="car-details-card">
                    <img src={car.imageUrl} alt={car.company} className="car-header-image" />
                    <div className="car-body">
                        <h2>{car.company}</h2>
                        <div className="specs-grid">
                            <div className="spec-item">
                                <span className="spec-label">שנה</span>
                                <span className="spec-value">{car.year}</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">צבע</span>
                                <span className="spec-value">{car.color}</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">מקומות</span>
                                <span className="spec-value">{car.placeNumber}</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">הילוכים</span>
                                <span className="spec-value">{car.gearType}</span>
                            </div>
                        </div>
                        <div className="price-section">
                            מחיר ליום: ₪{car.priceToDay}
                        </div>
                        {car.availability ? (
                            <div className="container mt-4 p-3 border rounded bg-white shadow-sm text-end" dir="rtl">
                                <h6 className="text-center mb-4 fw-bold text-primary">לוח זמינות - 60 ימים קרובים</h6>

                                <div className="row">
                                    {/* לולאה שיוצרת שני חודשים: 0 מייצג חודש נוכחי, 1 מייצג חודש הבא */}
                                    {/* לולאה על 3 חודשים אפשריים כדי להבטיח כיסוי מלא של 60 יום גם בסוף חודש */}
                                    {[0, 1, 2].map((monthOffset) => {
                                        const now = new Date();
                                        // חישוב מדויק של החודש והשנה היעד
                                        const targetDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
                                        const targetMonth = targetDate.getMonth();
                                        const targetYear = targetDate.getFullYear();
                                        const monthName = targetDate.toLocaleString('he-IL', { month: 'long' });
                                        const hasDaysInMonth = car.availability.some((_, index) => {
                                            const d = getRelativeDate(index);
                                            return d.monthNum === targetMonth && new Date().getFullYear() + (d.monthNum < now.getMonth() ? 1 : 0) === targetYear;
                                        });

                                        if (!hasDaysInMonth) return null;

                                        return (
                                            <div key={monthOffset} className="col-md-6 col-lg-4 mb-4">
                                                <h5 className="text-center border-bottom pb-2 mb-3 text-secondary">{monthName} {targetYear}</h5>
                                                <div className="row g-2 justify-content-center">
                                                    {car.availability.map((isOccupied, index) => {
                                                        const dateInfo = getRelativeDate(index);

                                                        // בדיקה כפולה: גם חודש וגם שנה (חשוב למעבר שנה בדצמבר-ינואר)
                                                        const isSameMonth = dateInfo.monthNum === targetMonth;
                                                        // חישוב שנה פשוט: אם חודש היעד קטן מהחודש הנוכחי, סימן שעברנו שנה
                                                        const isSameYear = (new Date().getFullYear() + (dateInfo.monthNum < now.getMonth() ? 1 : 0)) === targetYear;

                                                        if (!isSameMonth || !isSameYear) return null;

                                                        return (
                                                            <div key={index} className="col-auto">
                                                                <button
                                                                    onClick={() => handleDayClick(index)}
                                                                    title={dateInfo.fullDate}
                                                                    style={{ width: '45px', height: '45px' }}
                                                                    className={`btn d-flex align-items-center justify-content-center fw-bold rounded-2 p-0
                                    ${isOccupied ? 'btn-danger' : 'btn-outline-success'} 
                                    ${startDate === index ? 'border-primary border-3 shadow' : ''}`}
                                                                >
                                                                    {dateInfo.dayNum}
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* מקרא צבעים מעוצב עם Bootstrap badges */}
                                <div className="d-flex justify-content-center gap-3 mt-2 border-top pt-3" style={{ fontSize: '0.8rem' }}>
                                    <span className="badge bg-success">פנוי</span>
                                    <span className="badge bg-danger">תפוס</span>
                                    <span className="badge bg-primary">התחלת טווח</span>
                                </div>
                            </div>
                        )
                            : (
                                <p style={{ color: 'red', textAlign: 'center' }}>שגיאה: נתוני זמינות לא נמצאו</p>
                            )}
                        <button className="back-btn" onClick={() => window.history.back()}>
                            → חזרה לרשימה
                        </button>
                    </div>
                </div>
            </div>
      
    );
};
const getRelativeDate = (offset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return {
        dayNum: date.getDate(),
        monthNum: date.getMonth(),
        monthName: date.toLocaleString('he-IL', { month: 'long' }),
        fullDate: date.toLocaleDateString('he-IL')
    };
};

export default CarDetails;