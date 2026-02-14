import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ListCar from "./components/ListCars/listCars";
import CarDetails from "./components/CarDetails/CarDetails";
import MyForm from "./components/Login/Login";
import LoginForm from "./components/Connection/Connection";
import Navbar from "./components/Navbar/Navbar";
import NewCar from "./components/AddNewCar/AddNewCar";
import { LandingPage } from "./components/OpenPage/OpenPage";
import CarFilter from "./components/Filter/Filter"; // 👈 אל תשכח import
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css"

export default function App() {

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('isAdmin') === 'true';
})

  return (
    <BrowserRouter> 
      
      <Navbar onSearchClick={() => setIsSearchOpen(true)} />

      {isSearchOpen && (
        <CarFilter onClose={() => setIsSearchOpen(false)} />
      )}

      <Routes>
        <Route path="/" element={<LandingPage setIsAdmin={setIsAdmin} />} />
        <Route path="/cars" element={<ListCar isAdmin={isAdmin} />} />     
        <Route path="/car-details/:id" element={<CarDetails isAdmin={isAdmin} />} />   
        <Route path="/login" element={<MyForm />} />
        <Route path="/AddNewCar" element={<NewCar/>} />
        <Route path="/Connection" element={<LoginForm setIsAdmin={setIsAdmin} />} />  
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

    </BrowserRouter>
  );
}
