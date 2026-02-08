import React, { useState } from "react";
import type {Car} from "../Models/car";
import { Link } from 'react-router-dom';


interface CarCardProps{
 car:Car;
}

const CarCard = ({ car}: CarCardProps) => {
    return (
        <Link to={`/car/${car.id}`}>
        <div className="car-card">
            <img src="{car.imageUrl}" alt="{car.company}" />
            <h3>{car.company}</h3>
            <p>שנה: {car.year}</p>
            <p>מחיר ליום: ₪ {car.priceToDay}</p>
        </div>
        </Link>
    );
};
export default CarCard;


