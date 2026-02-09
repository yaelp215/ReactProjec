import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ListCar from "./components/ListCars/listCars"
import CarDetails from "./components/CarDetails/CarDetails"
import MyForm from "./components/Login/Login";

export default function App() {
  return (
    <BrowserRouter> 
    <Routes>
      <Route path="/" element= {<ListCar />}/>
      <Route path="/car-details/:id" element= {<CarDetails />}/>
      <Route path="/login" element={<MyForm />} />
    </Routes>
    </BrowserRouter>
    
  );
}