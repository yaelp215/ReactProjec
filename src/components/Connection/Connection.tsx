import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import "./Connection.css"
interface LoginFormProps {
    setIsAdmin: (value: boolean) => void;
}

export default function LoginForm({ setIsAdmin }: LoginFormProps) {
    const navigate = useNavigate();

    const loginSchema = Yup.object({
        email: Yup.string()
            .email("כתובת מייל לא תקינה")
            .required("חובה להכניס מייל"),
        password: Yup.string()
            .required("שדה חובה")
    });

    return (
        <div className="login-overlay">
            <div className="login-modal-container">
               
                <button className="close-btn" onClick={() => navigate('/')}>×</button>

                <div className="modal-content-wrapper">
                    
                  
                    <div className="info-section">
                        <div className="text-content">
                         <h1>המפתחות לרכב הבא שלך מחכים לך בפנים</h1>
                            <p className="subtitle">התחברו למערכת ותיהנו משירות VIP</p>
                        </div>
                    
                        <img 
                            src="/public/Image/Logo- DRIVON.png" 
                            alt="Car" 
                            className="car-image" 
                        />
                    </div>

                  
                    <div className="form-section">
                        <Formik
                            initialValues={{ email: "", password: "" }}
                            validationSchema={loginSchema}
                            onSubmit={async (values) => {
                                try {
                                    const response = await fetch(
                                        `http://localhost:3000/users?email=${values.email}&password=${values.password}`
                                    );
                                    const data = await response.json();
                                    if (data.length > 0) {
                                        const user = data[0];
                                        if (values.password === "AAAAAA") {
                                            setIsAdmin(true);
                                            console.log("המשתמש מנהל");
                                        } else {
                                            setIsAdmin(false);
                                        }
                                        alert(`ברוך הבא, ${user.firstName}!`);
                                        localStorage.setItem("user", JSON.stringify(user));
                                        window.dispatchEvent(new Event("storage"));
                                        navigate('/cars');
                                    } else {
                                        alert("פרטי התחברות שגויים");
                                    }
                                } catch (err) {
                                    console.error("שגיאה:", err);
                                    alert("תקלה בחיבור לשרת");
                                }
                            }}
                        >
                            <Form className="form-inner">
                                <h3>התחברות למערכת</h3>
                                
                                <div className="input-group">
                                    <Field name="email" type="email" placeholder="אימייל" />
                                    <ErrorMessage name="email" component="span" className="error-text" />
                                </div>

                                <div className="input-group">
                                    <Field name="password" type="password" placeholder="סיסמה" />
                                    <ErrorMessage name="password" component="span" className="error-text" />
                                </div>

                                <button type="submit" className="login-submit-btn">
                                    התחבר {'>'}
                                </button>

                                <div className="register-footer">
                                    <p>עדיין אין לך חשבון?</p>
                                    <button
                                        type="button"
                                        className="btn-register-link"
                                        onClick={() => navigate("/Login")}
                                    >
                                        להרשמה מהירה
                                    </button>
                                </div>
                            </Form>
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    );
}