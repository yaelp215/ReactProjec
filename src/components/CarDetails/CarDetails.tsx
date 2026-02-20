
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import type { Car } from '../Models/car';
import './CarDetails.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import OpinionSection from '../Opinion/Opinion';
import CarAvailabilityCalendar from '../CarAvailabilityCalendar/CarAvailabilityCalendar';
import AddOpinion from '../Addopinion/Addopinion';
import Swal from 'sweetalert2';
import axios from "axios";

interface CarDetailsProps {
    isAdmin: boolean;
}

const CarDetails: React.FC<CarDetailsProps> = ({ isAdmin }) => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [car, setcar] = useState<Car | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/cars/${id}`);
                setcar(response.data);
            } catch (error) {
                console.error("Error fetching car:", error);
            }
        };

        fetchCar();
    }, [id])
    const confirmBooking = async (selectedRange: number[]) => {
        if (!car || selectedRange.length === 0) return;

        const updatedAvailability = [...car.availability];
        selectedRange.forEach(index => {
            updatedAvailability[index] = true;
        });

try {
    await axios.patch(`http://localhost:3000/cars/${id}`, {
        availability: updatedAvailability
    });

   
    setcar({ ...car, availability: updatedAvailability });

    await Swal.fire({
        title: '!ההזמנה אושרה בהצלחה',
        html: `
            <div style="text-align: center;">
                <div style="background-color: #0076ff; padding: 20px; border-radius: 20px; display: inline-block; margin-bottom: 15px;">
                    <img src="/public/Image/Logo- DRIVON.png" alt="Drivon Logo" class="swal-order-animation" style="width: 130px;">
                </div>
                <p>איזה כיף! הרכב מחכה רק לך.</p>
            </div>
        `,
        confirmButtonText: 'מעולה, תודה!',
        confirmButtonColor: '#0076ff',
        customClass: { popup: 'my-swal-order-popup' }
    }).then(() => {
        navigate('/cars');
    });

} catch (error) {
    console.error("Booking error:", error);
}
    };

  const handleDeleteCar = async () => {
    if (window.confirm("למחוק את הרכב לצמיתות?")) {
        try {
            await axios.delete(`http://localhost:3000/cars/${id}`);
            navigate("/cars");
        } catch (error) {
            console.error("Error deleting car:", error);
        }
    }
};
    if (!car) return <div className="text-center mt-5">טוען נתונים...</div>;

    return (
        <div className="car-details-viewport">
            <div className="compact-container">

                {isAdmin && (
                    <div className="admin-mini-actions">
                        <button className="mini-btn warn" onClick={() => navigate(`/AddNewCar`, { state: { car: { ...car } } })}>✏️</button>
                        <button className="mini-btn danger" onClick={handleDeleteCar}>🗑️</button>
                    </div>
                )}

                <div className="compact-main-layout">

                  
                    <div className="column-right">
                        <div className="image-wrapper">
                            <img src={car.imageUrl || 'https://via.placeholder.com/400x200'} alt={car.company} />
                        </div>

                        <div className="opinions-section">
                            <div className="box-header">
                                <span className="title">חוות דעת</span>
                                <button className="add-btn-small" onClick={() => setShowAddForm(true)}>➕ הוספה</button>
                            </div>

                            {showAddForm && (
                                <div className="inline-form-overlay">
                                    <AddOpinion
                                        idCar={car.id}
                                        onClose={() => setShowAddForm(false)}
                                        onSaved={() => {
                                            setShowAddForm(false);
                                            setRefreshKey(prev => prev + 1);
                                        }}
                                    />
                                </div>
                            )}

                            <div className="opinions-scroll-area">
                                <OpinionSection idCar={car.id} key={refreshKey} />
                            </div>
                        </div>
                    </div>

                
                    <div className="column-left">
                        <div className="header-info">
                            <h1 className="car-name">{car.company}</h1>
                            <div className="compact-price">₪{car.priceToDay} <small>/ ליום</small></div>
                        </div>

                        <div className="specs-grid-mini">
                            <div className="mini-spec"><b>שנה:</b> {car.year}</div>
                            <div className="mini-spec"><b>צבע:</b> {car.color}</div>
                            <div className="mini-spec"><b>מושבים:</b> {car.placeNumber}</div>
                            <div className="mini-spec"><b>גיר:</b> {car.gearType}</div>
                        </div>

                        <div className="calendar-mini-container">
                            <CarAvailabilityCalendar car={car} confirmBooking={confirmBooking} />
                        </div>

                        <button className="back-btn-text" onClick={() => navigate(-1)}>→ חזרה</button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CarDetails;

