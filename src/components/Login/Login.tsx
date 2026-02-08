import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function isValidIsraeliID(id?: string) {
    if (!id) return false; // אם לא קיבלנו ערך, מחזירים false
    if (!/^\d{5,9}$/.test(id)) return false;
    // משלים ל-9 ספרות עם אפסים בצד שמאל
    id = id.padStart(9, '0');

    let sum = 0;
    for (let i = 0; i < 9; i++) {
        let num = Number(id[i]) * ((i % 2) + 1); // כפול 1 או 2
        if (num > 9) num -= 9; // אם >9, חיסור 9
        sum += num;
    }
    return sum % 10 === 0;
};
function isValidIsraeliPhone(phone?: string) {
    if (!phone) return false;

    const cleaned = phone.replace(/[\s-]/g, "");

    // בודקים אם מתחיל ב-0 ומכיל בדיוק 9 ספרות
    return /^0\d{8}$/.test(cleaned);
};
function isValidEmail(email?: string) {
    if (!email) return false;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export default function MyForm() {
    const validationSchema = Yup.object({
        firstName: Yup.string().required("יש למלא שם פרטי"),
        lastName: Yup.string().required("יש למלא שם משפחה"),
        year: Yup.number().required("חובה לציין שנת לידה")
            .min(2000)
            .max(2010),
        idNumber: Yup.string().required("חובה להכניס תז")
            .test(
                "is-valid-id",
                "תעודת זהות לא תקינה",
                (value?: string) => isValidIsraeliID(value || "")
            ),
        password: Yup.string()
            .required("שדה חובה")
            .min(8, "הסיסמה חייבת להיות לפחות 8 תווים")
            .matches(/[A-Z]/, "חייבת לכלול לפחות אות גדולה")
            .matches(/[a-z]/, "חייבת לכלול לפחות אות קטנה")
            .matches(/[0-9]/, "חייבת לכלול לפחות ספרה")
            .matches(/[!@#$%^&*]/, "חייבת לכלול לפחות תו מיוחד"),
        phone: Yup.string().required("חובה להכניס מספר פלאפון")
            .test(
                "is-valid-phone",
                " מספר לא תקין",
                (value?: string) => isValidIsraeliPhone(value || "")
            ),
        email: Yup.string().required("חובה להכניס מייל")
            .test(
                "is-valid-email",
                " מייל לא תקין",
                (value?: string) => isValidEmail(value || "")
            ),
    });

    return (
        <Formik
            initialValues={{
                firstName: "",
                lastName: "",
                year: "",
                idNumber: "",
                password: "",
                phone: "",
                email: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => console.log(values)}
             validateOnChange={true}
              validateOnBlur={true} 
              >
                   {({ errors, touched }) => (
            <Form>
                <div>
                    <Field name="firstName" placeholder="שם פרטי" />
                    <ErrorMessage name="firstName" component="div"  style={{ color: "red" }}/>
                    <Field name="lastName" placeholder="שם משפחה" />
                </div>
                <div>                
                    <Field type="number" name="year" placeholder="שנת לידה" />
                </div>
                 <div> 
                <Field name="idNumber" placeholder="תעודת זהות" />
                  </div>
                  <div> 
                <Field type="password" name="password" placeholder="סיסמה" />
                </div>
                <div>
                <Field name="phone" placeholder="טלפון" />
                </div>
                <div>
                <Field name="email" placeholder="מייל" />
                </div>
                <button type="submit">שלח</button>
                 <pre>{JSON.stringify({ errors, touched }, null, 2)}</pre>
            </Form>
                )}
        </Formik>
    );
};