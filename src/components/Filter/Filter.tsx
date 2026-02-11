import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Filter.css"

export default function CarFilter({ onClose }: { onClose: () => void }){
    const navigate = useNavigate();

     const [filters, setFilters] = useState({
    company: "",    
    color: "",
    placeNumber:0,
    priceToDay: 1000,
    fuelType:""
});
const handleSearch=()=>{
    const query=new URLSearchParams();
    if (filters.company) query.append("company", filters.company);
    if (filters.color) query.append("color", filters.color);
    if (filters.placeNumber) query.append("placeNumber", filters.placeNumber.toString());
if (filters.priceToDay) {
    query.append("priceToDay_lte", filters.priceToDay.toString());
}
    if (filters.fuelType) query.append("fuelType", filters.fuelType);
navigate(`/cars?${query.toString()}`);
 onClose();
}
 return (
    <div className="search-overlay" onClick={onClose}>
      <div className="drivon-search-container" onClick={(e) => e.stopPropagation()}>
        <div className="drivon-pill-bar">

          <button className="drivon-search-btn" onClick={handleSearch}>
            <svg viewBox="0 0 24 24" width="28" height="28" fill="#0076ff">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>

          {/* חברה */}
          <div className="drivon-input-group">
            <label>חברה</label>
            <select value={filters.company} onChange={(e) => setFilters({...filters, company: e.target.value})}>
              <option value="">כל החברות</option>
              <option value="Tesla">טסלה</option>
              <option value="Toyota">טויוטה</option>
              <option value="Hyundai">יונדאי</option>
              <option value="BYD">BYD</option>
              <option value="Skoda">סקודה</option>
              <option value="Kia">קיה</option>
              <option value="Volkswagen">פולקסווגן</option>
              <option value="Suzuki">סוזוקי</option>
              <option value="Mercedes">מרצדס</option>
              <option value="Honda">הונדה</option>
              <option value="Mitsubishi">מיצובישי</option>
              <option value="Volvo">וולוו</option>
              <option value="Dacia">דאצ'יה</option>
              <option value="Peugeot">פיג'ו</option>
              <option value="Audi">אאודי</option>
              <option value="Nissan">ניסאן</option>
              <option value="Subaru">סובארו</option>
              <option value="MG">MG</option>
              <option value="Ford">פורד</option>
            </select>
          </div>

          {/* צבע */}
          <div className="drivon-input-group">
            <label>צבע</label>
            <select value={filters.color} onChange={(e) => setFilters({...filters, color: e.target.value})}>
              <option value="">כל הצבעים</option>
              <option value="לבן">לבן</option>
              <option value="שחור">שחור</option>
              <option value="כסף">כסף</option>
              <option value="אפור">אפור</option>
              <option value="כחול">כחול</option>
              <option value="אדום">אדום</option>
              <option value="צהוב">צהוב</option>
              <option value="כתום">כתום</option>
              <option value="בורדו">בורדו</option>
            </select>
          </div>

          {/* סוג דלק */}
          <div className="drivon-input-group">
            <label>סוג דלק</label>
            <select value={filters.fuelType} onChange={(e) => setFilters({...filters, fuelType: e.target.value})}>
              <option value="">הכל</option>
              <option value="fuel">בנזין</option>
              <option value="electric">חשמלי</option>
              <option value="hybrid">היברידי</option>
            </select>
          </div>

          {/* מושבים */}
          <div className="drivon-input-group">
            <label>מושבים</label>
            <input 
              type="number" 
              placeholder="כמה?" 
              value={filters.placeNumber || ""} 
              onChange={(e) => setFilters({...filters, placeNumber: Number(e.target.value)})} 
            />
          </div>

          {/* מחיר */}
          <div className="drivon-input-group">
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <label>מחיר ליום</label>
              <span style={{fontSize:'12px', fontWeight:'bold'}}>₪{filters.priceToDay}</span>
            </div>
            <input 
              type="range" min="100" max="1000" step="50"
              value={filters.priceToDay}
              className="drivon-range"
              onChange={(e) => setFilters({...filters, priceToDay: Number(e.target.value)})} 
            />
          </div>

        </div>
      </div>
    </div>
  );
}