
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type {Car} from '../Models/car';
import './CarDetails.css';

const CarDetails = ()=>{
    const { id } = useParams();
    const [car, setcar] = useState<Car>();
    useEffect(() => {
        fetch(`http://localhost:3000/cars/${id}`)
            .then(res => res.json())
            .then(data => setcar(data))
            .catch(err => console.error("Error fetching car:", err));
    }, [id]);
    if (!car) return <div>טוען נתונים...</div>;
return (
    <div className="car-details-page">
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

                <p style={{ color: '#bdc3c7', marginTop: '20px', fontSize: '0.8rem' }}>
                    מזהה מערכת: {id}
                </p>

                <button className="back-btn" onClick={() => window.history.back()}>
                    → חזרה לרשימה
                </button>
            </div>
        </div>
    </div>
);

}

export default CarDetails;