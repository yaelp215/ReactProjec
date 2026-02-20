import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import "./Connection.css"
import Swal from 'sweetalert2';
import axios from "axios";
interface LoginFormProps {
    setIsAdmin: (value: boolean) => void;
}


const LoginForm: React.FC<LoginFormProps> = ({ setIsAdmin }) => {

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
                                    const response = await axios.get(`http://localhost:3000/users`, {
                                        params: {
                                            email: values.email,
                                            password: values.password
                                        }
                                    });
                                    const data = await response.data;
                                    if (data.length > 0) {
                                        const user = data[0];
                                        if (values.password === "AAAAAA") {
                                            setIsAdmin(true);
                                            localStorage.setItem('isAdmin', 'true');
                                            console.log("המשתמש מנהל");
                                        } else {
                                            setIsAdmin(false);
                                        }
                                        localStorage.setItem("user", JSON.stringify(user));
                                        window.dispatchEvent(new Event("storage"));
                                        Swal.fire({
                                            title: `!ברוך הבא, ${user?.firstName}`,
                                            text: 'התחברת בהצלחה למערכת',
                                            icon: 'success',
                                            confirmButtonColor: '#0076ff',
                                            allowOutsideClick: false,
                                            timer: 2000,
                                            timerProgressBar: true,
                                            showConfirmButton: false
                                        }).then(() => {
                                            navigate('/cars');
                                        });



                                    } else {
                                        Swal.fire({
                                            title: 'אופס... משהו השתבש',
                                            text: 'המייל או הסיסמה שהזנת אינם נכונים. נסי שוב!',
                                            icon: 'error',
                                            confirmButtonText: 'הבנתי, אנסה שוב',
                                            confirmButtonColor: '#d33', // צבע אדום לשגיאה
                                            target: 'body', // מבטיח שזה יצוף מעל הכל
                                            customClass: {
                                                popup: 'my-swal-error-popup'
                                            }
                                        });
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
export default LoginForm;