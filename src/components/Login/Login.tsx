import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import './Login.css'; 
import type {user} from "../Models/user"

// פונקציית אימות טלפון מעודכנת (תומכת ב-9 או 10 ספרות)
function isValidIsraeliPhone(phone?: string) {
    if (!phone) return false;
    const cleaned = phone.replace(/[\s-]/g, "");
    return /^0\d{8,9}$/.test(cleaned);
};

export default function MyForm() {
    const [users, setUsers] = useState<user[]>([]);

    useEffect(() => {
        fetch("http://localhost:3000/users")
            .then(res => res.json())
            .then(data => {
                setUsers(data); // מעדכן את הרשימה בזיכרון
                console.log("נתונים שנטענו מה-DB:", data);
            })
            .catch(err => console.error("שגיאה בטעינה:", err));
    }, []);

    const validationSchema = Yup.object({
        firstName: Yup.string().trim().required("יש למלא שם פרטי"),
        lastName: Yup.string().trim().required("יש למלא שם משפחה"),
        year: Yup.number()
            .typeError("יש להזין מספר בלבד")
            .required("חובה לציין שנת לידה")
            .min(1920, "שנה לא תקינה")
            .max(2010, "ההרשמה מגיל 16 ומעלה"), // דוגמה ללוגיקה
        password: Yup.string()
            .required("שדה חובה")
            .min(8, "הסיסמה חייבת להיות לפחות 8 תווים")
            .matches(/[A-Z]/, "חייבת לכלול לפחות אות גדולה")
            .matches(/[a-z]/, "חייבת לכלול לפחות אות קטנה")
            .matches(/[0-9]/, "חייבת לכלול לפחות ספרה")
            .matches(/[!@#$%^&*]/, "חייבת לכלול לפחות תו מיוחד"),
        phone: Yup.string()
            .required("חובה להכניס מספר טלפון")
            .test("is-valid-phone", "מספר טלפון לא תקין", value => isValidIsraeliPhone(value)),
        email: Yup.string()
            .email("כתובת מייל לא תקינה") // שימוש בוולידציה המובנית של Yup
            .required("חובה להכניס מייל"),
    });

    return (
        <Formik
            initialValues={{
                firstName: "",
                lastName: "",
                year: "",
                password: "",
                phone: "",
                email: "",
            }}
            validationSchema={validationSchema}
onSubmit={async (values, { resetForm }) => {                const newUser = {...values, id: Date.now().toString()} as user;
try {
        // 2. שליחת המשתמש החדש לשרת (ל-db.json)
        const response = await fetch("http://localhost:3000/users", {
            method: "POST", // מציין שאנחנו מוסיפים נתונים חדשים
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser), // הופך את האובייקט לטקסט שהשרת מבין
        });

        if (response.ok) {
            // 3. רק אם השמירה בשרת הצליחה, נעדכן את ה-State המקומי כדי לראות אותו במסך
            setUsers((prevUsers) => {
                const updatedList = [...prevUsers, newUser];
                console.log("רשימה מעודכנת לאחר שמירה ב-DB:", updatedList);
                return updatedList;
            });

            resetForm();
            alert("המשתמש נשמר ב-DB בהצלחה!");
        } else {
            alert("הייתה בעיה בשמירת המשתמש בשרת.");
        }
    } catch (err) {
        console.error("שגיאה בתקשורת עם השרת:", err);
        alert("לא ניתן לגשת לשרת. וודאי ש-json-server רץ.");
    }
}}
        >
            <Form className="form-container">
                <div>
                    <Field name="firstName" placeholder="שם פרטי" />
                    <ErrorMessage name="firstName" component="span" className="error-text" />
                </div>
                
                <div>
                    <Field name="lastName" placeholder="שם משפחה" />
                    <ErrorMessage name="lastName" component="span" className="error-text" />
                </div>

                <div>
                    <Field type="number" name="year" placeholder="שנת לידה" />
                    <ErrorMessage name="year" component="span" className="error-text" />
                </div>

                <div>
                    <Field type="password" name="password" placeholder="סיסמה" />
                    <ErrorMessage name="password" component="span" className="error-text" />
                </div>

                <div>
                    <Field name="phone" placeholder="טלפון" />
                    <ErrorMessage name="phone" component="span" className="error-text" />
                </div>

                <div>
                    <Field name="email" type="email" placeholder="מייל" />
                    <ErrorMessage name="email" component="span" className="error-text" />
                </div>

                <button type="submit">שלח</button>
            </Form>

        </Formik>
        
    );
};