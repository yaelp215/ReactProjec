// import React, { useState } from 'react';
// import type { Car } from '../Models/car';

// interface CarAvailabilityCalendarProps {
//     car: Car;
//     confirmBooking: (selectedRange: number[]) => void;
// }

// const CarAvailabilityCalendar: React.FC<CarAvailabilityCalendarProps> = ({ car, confirmBooking }) => {
//     const [startDate, setStartDate] = useState<number | null>(null);
//     const [selectedRange, setSelectedRange] = useState<number[]>([]);

//     const handleDayClick = (index: number): void => {
//         if (!car || car.availability[index]) return;

//         if (startDate === null) {
//             setStartDate(index);
//             setSelectedRange([index]);
//         } else {
//             const start = Math.min(startDate, index);
//             const end = Math.max(startDate, index);
//             const newRange: number[] = [];

//             for (let i = start; i <= end; i++) {
//                 if (car.availability[i]) {
//                     alert("חלק מהימים בטווח תפוסים. נא בחר שוב.");
//                     setStartDate(null);
//                     setSelectedRange([]);
//                     return;
//                 }
//                 newRange.push(i);
//             }
//             setSelectedRange(newRange);
//             setStartDate(null);
//         }
//     };

//     return (
//         <div className="container p-3 border rounded bg-white shadow-sm" dir="rtl">
//             <h6 className="text-center mb-4 fw-bold text-primary border-bottom pb-2">לוח זמינות - 60 ימים קרובים</h6>
//             <div className="row">
//                 {[0, 1, 2].map((monthOffset) => {
//                     const now = new Date();
//                     const targetDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
//                     const targetMonth = targetDate.getMonth();
//                     const targetYear = targetDate.getFullYear();
//                     const monthName = targetDate.toLocaleString('he-IL', { month: 'long' });

//                     const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
//                     const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

//                     return (
//                         <div key={monthOffset} className="col-md-6 col-lg-4 mb-4">
//                             <h6 className="text-center text-secondary mb-3">{monthName} {targetYear}</h6>
//                             <div className="row g-2 justify-content-center">
//                                 {daysArray.map((dayNum) => {
//                                     const currentBtnDate = new Date(targetYear, targetMonth, dayNum);
//                                     const today = new Date();
//                                     today.setHours(0, 0, 0, 0);

//                                     const diffTime = currentBtnDate.getTime() - today.getTime();
//                                     const dayIndex = Math.floor(diffTime / (1000 * 60 * 60 * 24));

//                                     const isInRange = dayIndex >= 0 && dayIndex < car.availability.length;
//                                     const isOccupied = isInRange ? car.availability[dayIndex] : false;
//                                     const isTemp = selectedRange.includes(dayIndex);

//                                     let btnClass = "btn-secondary opacity-25"; 
//                                     if (isInRange) {
//                                         if (isOccupied) btnClass = "btn-danger";
//                                         else if (isTemp) btnClass = "btn-primary text-white";
//                                         else btnClass = "btn-outline-success";
//                                     }

//                                     return (
//                                         <div key={dayNum} className="col-auto">
//                                             <button
//                                                 onClick={() => isInRange && handleDayClick(dayIndex)}
//                                                 disabled={!isInRange || isOccupied}
//                                                 className={`btn btn-sm d-flex align-items-center justify-content-center fw-bold
//                                                     ${btnClass}
//                                                     ${startDate === dayIndex ? 'border-warning border-3 shadow' : ''}`}
//                                                 style={{ 
//                                                     width: '40px', 
//                                                     height: '40px',
//                                                     cursor: (!isInRange || isOccupied) ? 'not-allowed' : 'pointer'
//                                                 }}
//                                             >
//                                                 {dayNum}
//                                             </button>
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>

//             <div className="d-flex justify-content-center flex-wrap gap-3 mt-3 small">
//                 <span className="badge bg-success">פנוי</span>
//                 <span className="badge bg-danger">תפוס</span>
//                 <span className="badge bg-primary">הבחירה שלך</span>
//                 <span className="badge bg-secondary opacity-50">לא ניתן להזמנה</span>
//             </div>

//             {selectedRange.length > 0 && (
//                 <div className="mt-4 p-3 bg-light border border-primary rounded text-center">
//                     <p className="mb-2 fw-bold">סה"כ ימים: {selectedRange.length} | סכום: ₪{selectedRange.length * car.priceToDay}</p>
//                     <div className="d-flex justify-content-center gap-2">
//                         <button className="btn btn-success fw-bold" onClick={() => confirmBooking(selectedRange)}>אישור הזמנה סופי</button>
//                         <button className="btn btn-sm btn-outline-danger" onClick={() => {setSelectedRange([]); setStartDate(null);}}>ביטול</button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default CarAvailabilityCalendar;
import React, { useState } from 'react';
import type { Car } from '../Models/car';
import "./CarAvailabilityCalender.css"

interface CarAvailabilityCalendarProps {
    car: Car;
    confirmBooking: (selectedRange: number[]) => void;
}

const CarAvailabilityCalendar: React.FC<CarAvailabilityCalendarProps> = ({ car, confirmBooking }) => {
    const [startDate, setStartDate] = useState<number | null>(null);
    const [selectedRange, setSelectedRange] = useState<number[]>([]);

    const handleDayClick = (index: number): void => {
        if (!car || car.availability[index]) return;

        if (startDate === null) {
            setStartDate(index);
            setSelectedRange([index]);
        } else {
            const start = Math.min(startDate, index);
            const end = Math.max(startDate, index);
            const newRange: number[] = [];

            for (let i = start; i <= end; i++) {
                if (car.availability[i]) {
                    alert("חלק מהימים בטווח תפוסים. נא בחר שוב.");
                    setStartDate(null);
                    setSelectedRange([]);
                    return;
                }
                newRange.push(i);
            }
            setSelectedRange(newRange);
            setStartDate(null);
        }
    };

    return (
        <div className="calendar-card" dir="rtl">
            <h5 className="calendar-main-title">לוח זמינות והזמנה</h5>
            
            <div className="months-wrapper">
                {[0, 1].map((monthOffset) => { // נציג 2 חודשים קדימה למראה נקי
                    const now = new Date();
                    const targetDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
                    const targetMonth = targetDate.getMonth();
                    const targetYear = targetDate.getFullYear();
                    const monthName = targetDate.toLocaleString('he-IL', { month: 'long' });

                    // חישוב היום בשבוע שבו מתחיל החודש (0 = ראשון)
                    const firstDayOfMonth = new Date(targetYear, targetMonth, 1).getDay();
                    const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
                    
                    // יצירת מערך של תאים ריקים להתחלה
                    const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);
                    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

                    return (
                        <div key={monthOffset} className="month-section">
                            <h6 className="month-title">{monthName} {targetYear}</h6>
                            
                            <div className="calendar-grid">
                                {/* שמות ימים */}
                                {['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'].map(d => (
                                    <div key={d} className="weekday-header">{d}</div>
                                ))}

                                {/* תאים ריקים לסנכרון ימי השבוע */}
                                {emptyDays.map(e => <div key={`empty-${e}`} className="day-cell empty"></div>)}

                                {daysArray.map((dayNum) => {
                                    const currentBtnDate = new Date(targetYear, targetMonth, dayNum);
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);

                                    const diffTime = currentBtnDate.getTime() - today.getTime();
                                    const dayIndex = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                                    const isInRange = dayIndex >= 0 && dayIndex < car.availability.length;
                                    const isOccupied = isInRange ? car.availability[dayIndex] : false;
                                    const isSelected = selectedRange.includes(dayIndex);
                                    const isStart = startDate === dayIndex;

                                    let dayState = "disabled";
                                    if (isInRange) {
                                        if (isOccupied) dayState = "occupied";
                                        else if (isSelected) dayState = "selected";
                                        else dayState = "available";
                                    }

                                    return (
                                        <button
                                            key={dayNum}
                                            onClick={() => isInRange && handleDayClick(dayIndex)}
                                            disabled={dayState === "disabled" || dayState === "occupied"}
                                            className={`day-cell ${dayState} ${isStart ? 'start-pick' : ''}`}
                                        >
                                            {dayNum}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* מקרא */}
          <div className="calendar-legend">
    <div className="legend-item available">
        <span className="box available"></span>
        <span>פנוי</span>
    </div>
    <div className="legend-item occupied">
        <span className="box occupied"></span>
        <span>תפוס</span>
    </div>
    <div className="legend-item selected">
        <span className="box selected"></span>
        <span>הבחירה שלך</span>
    </div>
</div>

            {/* סיכום הזמנה צף */}
           {selectedRange.length > 0 && (
    <div className="booking-summary" dir="rtl">
        <div className="summary-info">
            <span>
                סה"כ זמן: <strong>{selectedRange.length} ימים</strong>
            </span>
            <span className="price-tag">
                {selectedRange.length * car.priceToDay}
            </span>
        </div>
        
        <div className="summary-actions">
            <button className="btn-confirm" onClick={() => confirmBooking(selectedRange)}>
                אישור והזמנה
            </button>
            <button className="btn-cancel" onClick={() => {setSelectedRange([]); setStartDate(null);}}>
                ביטול
            </button>
        </div>
    </div>
)}
        </div>
    );
};

export default CarAvailabilityCalendar;