import CarCard from '../CarCard/CarCard';
import type {Car} from '../Models/car';
import axios from 'axios';
import { useEffect, useState } from 'react';

const ListCar = ()=>{
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
        <div className='car-list-contauner'>
            <h2>אני קומפוננטת הרשימה!</h2>
            {cars.map((singleCar) => (
                <CarCard car={singleCar}
                ></CarCard>
            ))}
        </div>
    );

};
export default ListCar;