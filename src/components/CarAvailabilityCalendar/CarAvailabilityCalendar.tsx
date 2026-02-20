
import React, { useState } from 'react';
import type { Car } from '../Models/car';
import "./CarAvailabilityCalender.css"
import Swal from 'sweetalert2';


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
                    Swal.fire({
                        icon: 'warning',
                        title: 'שימי לב',
                        text: 'חלק מהימים בטווח תפוסים. נא בחרי שוב.',
                        confirmButtonText: 'אישור',
                        confirmButtonColor: '#f39c12'
                    });
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
                {[0, 1].map((monthOffset) => { 
                    const now = new Date();
                    const targetDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
                    const targetMonth = targetDate.getMonth();
                    const targetYear = targetDate.getFullYear();
                    const monthName = targetDate.toLocaleString('he-IL', { month: 'long' });

               
                    const firstDayOfMonth = new Date(targetYear, targetMonth, 1).getDay();
                    const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();

                
                    const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);
                    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

                    return (
                        <div key={monthOffset} className="month-section">
                            <h6 className="month-title">{monthName} {targetYear}</h6>

                            <div className="calendar-grid">
                            
                                {['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'].map(d => (
                                    <div key={d} className="weekday-header">{d}</div>
                                ))}

                    
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
                        <button className="btn-cancel" onClick={() => { setSelectedRange([]); setStartDate(null); }}>
                            ביטול
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CarAvailabilityCalendar;