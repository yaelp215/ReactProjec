
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

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
                            console.log("המשתמש מנהל")
                        } else {
                            setIsAdmin(false);
                        }
                        alert(`ברוך הבא, ${user.firstName}!`);
                        localStorage.setItem("user", JSON.stringify(user));
                        navigate('/')
                    } else {
                        alert("יש לבצע התחברות");
                    }
                } catch (err) {
                    console.error("שגיאה:", err);
                    alert("תקלה בחיבור לשרת");
                }
            }}
        >
            <Form className="form-container">
                <h2>התחברות</h2>
                <div>
                    <Field name="email" type="email" placeholder="מייל" />
                    <ErrorMessage name="email" component="span" className="error-text" />
                </div>

                <div>
                    <Field name="password" type="password" placeholder="סיסמה" />
                    <ErrorMessage name="password" component="span" className="error-text" />
                </div>

                <button type="submit">התחבר</button>
                <p>עדיין אין לך חשבון?</p>
                <button
                    type="button"
                    onClick={() => navigate("/login")}
                >
                    להרשמה
                </button>

            </Form>
        </Formik>
    );
}