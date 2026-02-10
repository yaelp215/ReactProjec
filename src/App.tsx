import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ListCar from "./components/ListCars/listCars"
import CarDetails from "./components/CarDetails/CarDetails"
import MyForm from "./components/Login/Login";
import LoginForm from "./components/Connection/Connection"
import Navbar from "./components/Navbar/Navbar";
import NewCar from "./components/AddNewCar/AddNewCar"
import 'bootstrap/dist/css/bootstrap.min.css';
export default function App() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  return (
    <BrowserRouter> 
    <Navbar />
    <Routes>
<Route path="/" element={<ListCar isAdmin={isAdmin} />} />      
<Route path="/car-details/:id" element={<CarDetails isAdmin={isAdmin} />} />      <Route path="/login" element={<MyForm />} />
       <Route path="/AddNewCar" element={<NewCar/>} />
<Route path="/Connection" element={<LoginForm setIsAdmin={setIsAdmin} />} />    </Routes>
    </BrowserRouter>
    
  );
}