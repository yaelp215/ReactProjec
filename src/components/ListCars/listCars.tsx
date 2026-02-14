import CarCard from '../CarCard/CarCard';
import type { Car } from '../Models/car';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface ListCarProps {
    isAdmin: boolean;
}

const ListCar: React.FC<ListCarProps> = ({ isAdmin }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [cars, setCars] = useState<Car[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const carsPerPage = 10;

    useEffect(() => {
   const currentQuery = location.search;
        axios.get(`http://localhost:3000/cars${currentQuery}`)
            .then(response => {
                setCars(response.data);
                setCurrentPage(1);
            })
            .catch(error => console.error("שגיאה:", error));
    }, [location.search]);

    const indexOfLastCar = currentPage * carsPerPage;
    const indexOfFirstCar = indexOfLastCar - carsPerPage;
    const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);

    const totalPages = Math.ceil(cars.length / carsPerPage);

    return (
        /* הגבלת גובה הקומפוננטה ל-85% מגובה המסך כדי למנוע גלילה */
        <div className="container-fluid px-5 d-flex flex-column justify-content-between" style={{ minHeight: '80vh', maxHeight: '85vh' }}>
            
            <div>
                {/* שורת כפתור הוספה - כחול מותאם למותג */}
                <div className="d-flex justify-content-end mb-3">
                    {isAdmin && (
                        <button 
                            className="btn px-4 shadow-sm text-white" 
                            style={{ backgroundColor: '#007bff', borderRadius: '50px', fontWeight: 'bold' }}
                            onClick={() => navigate("/AddNewCar")}
                        >
                            + הוספת רכב חדש
                        </button>
                    )}
                </div>

                {/* תצוגת הרכבים */}
                <div className='row row-cols-1 row-cols-md-5 g-3'>
                    {currentCars.map((singleCar) => (
                        <div className="col" key={singleCar.id}>
                            <CarCard car={singleCar} />
                        </div>
                    ))}
                </div>
            </div>

            {/* ניווט (Pagination) - מעוצב בכחול */}
            {totalPages > 1 && (
                <nav className="d-flex justify-content-center mt-3">
                    <ul className="pagination pagination-sm mb-0">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" style={{ color: '#007bff' }} onClick={() => setCurrentPage(currentPage - 1)}>הקודם</button>
                        </li>
                        {[...Array(totalPages)].map((_, i) => (
                            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button 
                                    onClick={() => setCurrentPage(i + 1)} 
                                    className="page-link"
                                    style={currentPage === i + 1 ? { backgroundColor: '#007bff', borderColor: '#007bff' } : { color: '#007bff' }}
                                >
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" style={{ color: '#007bff' }} onClick={() => setCurrentPage(currentPage + 1)}>הבא</button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
};

export default ListCar;