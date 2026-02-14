import type { Car } from "../Models/car";
import { Link } from 'react-router-dom';
import "./CarCard.css"

interface CarCardProps {
    car: Car;
}

const CarCard = ({ car }: CarCardProps) => {
    return (
        <Link to={`/car-details/${car.id}`} style={{ textDecoration: 'none' }}>
            <div className="card h-100 border-0 shadow-sm car-custom-card">
                <div className="car-brand-badge">
                    <img src="/public/Image/Logo- DRIVON.png" alt="Logo" />
                </div>
                <div className="p-2 text-center">
                    <img src={car.imageUrl} alt={car.company} className="card-img-top" 
                         style={{ height: '120px', objectFit: 'contain' }} />
                </div>
                <div className="card-body p-2 text-end">
                    <h6 className="fw-bold mb-1" style={{ color: '#007bff' }}>{car.company}</h6>
                    <div className="d-flex gap-1 mb-2 justify-content-end">
                        <span className="badge" style={{ backgroundColor: '#e6f0ff', color: '#007bff', fontWeight: 'normal' }}>
                            {car.year}
                        </span>
                        <span className="badge" style={{ backgroundColor: '#e6f0ff', color: '#007bff', fontWeight: 'normal' }}>
                            בנזין
                        </span>
                    </div>

                  
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold" style={{ color: '#007bff', fontSize: '1.1rem' }}>₪ {car.priceToDay}</span>
                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>מחיר ליום</small>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CarCard;