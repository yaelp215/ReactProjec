import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ListCar from "./components/ListCars/listCars"
import CarDetails from "./components/CarDetails/CarDetails"
import MyForm from "./components/Login/Login";
import LoginForm from "./components/Connection/Connection"
import Navbar from "./components/Navbar/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
export default function App() {
  return (
    <BrowserRouter> 
    <Navbar />
    <Routes>
      <Route path="/" element= {<ListCar />}/>
      <Route path="/car-details/:id" element= {<CarDetails />}/>
      <Route path="/login" element={<MyForm />} />
      <Route path="/Connection" element={<LoginForm />} />
    </Routes>
    </BrowserRouter>
    
  );
}