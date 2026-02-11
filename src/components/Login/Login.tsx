import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import './Login.css';
import type { user } from "../Models/user"
import { useNavigate,useLocation } from "react-router-dom";

function isValidIsraeliPhone(phone?: string) {
    if (!phone) return false;
    const cleaned = phone.replace(/[\s-]/g, "");
    return /^0\d{8,9}$/.test(cleaned);
};

export default function MyForm() {
    const location = useLocation();
    const isEditMode = location.state?.editMode;
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const navigate = useNavigate();
    const [users, setUsers] = useState<user[]>([]);

    useEffect(() => {
        fetch("http://localhost:3000/users")
            .then(res => res.json())
            .then(data => {
                setUsers(data); 
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
            .max(2010, "ההרשמה מגיל 16 ומעלה"), 
        password: Yup.string()
            .required("שדה חובה")
            .test("is-admin-or-strong", "הסיסמה אינה עומדת באבטחה", (value) => {
                if (value === "AAAAAA") return true;
                const hasMinLength = (value?.length || 0) >= 8;
                const hasUpperCase = /[A-Z]/.test(value || "");
                const hasLowerCase = /[a-z]/.test(value || "");
                const hasNumber = /[0-9]/.test(value || "");
                const hasSpecialChar = /[!@#$%^&*]/.test(value || "");
                if (hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar) {
                    return true;
                }
            }),
        phone: Yup.string()
            .required("חובה להכניס מספר טלפון")
            .test("is-valid-phone", "מספר טלפון לא תקין", value => isValidIsraeliPhone(value)),
        email: Yup.string()
            .email("כתובת מייל לא תקינה") 
            .required("חובה להכניס מייל"),
    });
return (
    <div className="login-overlay"> 
        <div className="register-modal-frame"> 
            <div className="form-section-white">
                  <Formik
        enableReinitialize={true}

            initialValues={
                isEditMode && storedUser ?{
                    firstName: storedUser.firstName,
        lastName: storedUser.lastName,
        year: storedUser.year,
        password: storedUser.password,
        phone: storedUser.phone,
        email: storedUser.email,
                }:{
                firstName: "",
                lastName: "",
                year: "",
                password: "",
                phone: "",
                email: "",
            }}
            validationSchema={validationSchema}
     onSubmit={async (values) => {
    try {
        const url = isEditMode 
            ? `http://localhost:3000/users/${storedUser.id}` 
            : "http://localhost:3000/users"; 

        const method = isEditMode ? "PUT" : "POST";

        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(isEditMode ? { ...values, id: storedUser.id } : { ...values, id: Date.now().toString() }),
        });

        if (response.ok) {
            if (isEditMode) {
                localStorage.setItem("user", JSON.stringify({ ...values, id: storedUser.id }));
                window.dispatchEvent(new Event("storage"));
                alert("הפרטים עודכנו בהצלחה!");
            } else {
                alert("נרשמת בהצלחה!");
            }
            navigate("/cars"); // חזרה לדף הבית
        }
    } catch (err) {
        console.error("Error:", err);
    }
}}
        >
                    <Form className="form-inner">
                        <h3>{isEditMode ? "עדכון פרטים" : "הרשמה למערכת"}</h3>
                        
                        <div className="input-group">
                            <Field name="firstName" placeholder="שם פרטי" />
                            <ErrorMessage name="firstName" component="span" className="error-text" />
                        </div>

                        <div className="input-group">
                            <Field name="lastName" placeholder="שם משפחה" />
                            <ErrorMessage name="lastName" component="span" className="error-text" />
                        </div>

                        <div className="input-group">
                            <Field type="number" name="year" placeholder="שנת לידה" />
                            <ErrorMessage name="year" component="span" className="error-text" />
                        </div>

                        <div className="input-group">
                            <Field type="password" name="password" placeholder="סיסמה" />
                            <ErrorMessage name="password" component="span" className="error-text" />
                        </div>

                        <div className="input-group">
                            <Field name="phone" placeholder="טלפון" />
                            <ErrorMessage name="phone" component="span" className="error-text" />
                        </div>

                        <div className="input-group">
                            <Field name="email" type="email" placeholder="מייל" />
                            <ErrorMessage name="email" component="span" className="error-text" />
                        </div>

                        <button type="submit" className="login-submit-btn">שלח</button>
                    </Form>
                </Formik>
                
                <button className="close-btn-dark" onClick={() => navigate("/")}>×</button>
            </div>
        </div>
    </div>
);

};