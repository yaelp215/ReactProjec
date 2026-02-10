import CarCard from '../CarCard/CarCard';
import type {Car} from '../Models/car';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

interface ListCarProps{
    isAdmin: boolean;
}
const ListCar: React.FC<ListCarProps> = ({isAdmin})=>{
    const navigate = useNavigate();
    const [cars, setcars] = useState<Car[]>([]);

    useEffect (() => {
        axios.get("http://localhost:3000/cars")
        .then(response =>{
            console.log("הנתונים שהתקבלו:", response.data);
           setcars(response.data);
        })
        .catch(error => {
            console.error("שגיאה בשליפת נתונים:", error);
        });
        

    }, []);
    return(
        <div>
<div className="container">     
    {isAdmin && (
        <button className="btn- btn-success mb-3"
        onClick={() => navigate("/AddNewCar")}>הוספת רכב חדש</button>
    )}       
        </div>
        <div className='car-list-contauner'>
            {cars.map((singleCar) => (
                <CarCard 
                car={singleCar}
                key={singleCar.id}
                ></CarCard>
            ))}
        </div>
        </div>

    );

};
export default ListCar;