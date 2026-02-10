import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import type {  CombustionCar,ElectricCar} from "../Models/car"
import axios from "axios";
type CarFormValues =
  | Omit<ElectricCar, "id">
  | Omit<CombustionCar, "id">;
export default function NewCar() {
    const navigate = useNavigate();
    const validationSchema = Yup.object({
        company: Yup.string().trim().required("יש למלא שם חברה"),
        year: Yup.number().typeError("יש להזין מספר").min(1900, "שנה לא תקינה")
            .max(new Date().getFullYear() + 1, "שנה לא תקינה")
            .required("יש למלא שנה"),
        gearType: Yup.string().oneOf(["automatic", "manual"]).required("יש לבחור סוג גיר"),
        color: Yup.string().trim().required("יש למלא צבע רכב"),
        priceToDay: Yup.number().typeError("יש להזין מספר").required("יש למלא מחיר"),
        fuelType: Yup.string().oneOf(["electric", "hybrid", "fuel"]).required("יש לבחור סוג דלק"),
        imageUrl: Yup.string().url("כתובת תמונה לא תקינה"),
        fuelConsumption: Yup.number().when("fuelType", {
            is: (val: string) => val !== "electric",
            then: (schema) => schema.required("יש למלא צריכת דלק").min(0, "לא יכול להיות שלילי"),
            otherwise: (schema) => schema.notRequired(),
        }),
    })
    const initialValues:  CarFormValues = {
        company: "",
        year: new Date().getFullYear(),
        color: "",
        placeNumber: 5,
        gearType: "automatic",
        priceToDay: 0,
        imageUrl: "",
        fuelType: "fuel",
        fuelConsumption: 0,
        availability: new Array(60).fill(false),
    };
    const handleSubmit = async (values: CarFormValues, { setSubmitting, resetForm }: FormikHelpers<CarFormValues>) => {
        console.log("נתוני הרכב החדש:", values);
        try {
            const carToSend = {
                ...values,
                id: `c${Date.now()}`,
                availability: values.availability || new Array(60).fill(false)
            };
            const response = await axios.post("http://localhost:3000/cars", carToSend);
            if (response.status === 201) {
                alert("הרכב נוסף בהצלחה!");
                resetForm();
                navigate("/");
            }

        } catch (error) {
            console.error("שגיאה בהוספת הרכב:", error);
            alert("אופס! הייתה שגיאה בחיבור לשרת");
        } finally {
            setSubmitting(false); // מאפשר ללחוץ שוב על הכפתור
        }

    };
    return (
        <div className="container">
            <h1>הוספת רכב חדש</h1>
            
            <Formik<CarFormValues>
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values }) => (
                    <Form>
                        <div className="form-group">
                            <label>חברה:</label>
                            <Field name="company" className="form-control" />
                            <ErrorMessage name="company" component="span" className="text-danger" />
                        </div>

                        <div className="form-group">
                            <label>שנה:</label>
                            <Field name="year" type="number" className="form-control" />
                            <ErrorMessage name="year" component="span" className="text-danger" />
                        </div>

                        <div className="form-group">
                            <label>צבע:</label>
                            <Field name="color" className="form-control" />
                            <ErrorMessage name="color" component="span" className="text-danger" />
                        </div>

                        <div className="form-group">
                            <label>מספר מושבים:</label>
                            <Field name="placeNumber" type="number" className="form-control" />
                            <ErrorMessage name="placeNumber" component="span" className="text-danger" />
                        </div>

                        <div className="form-group">
                            <label>סוג גיר:</label>
                            <Field as="select" name="gearType" className="form-control">
                                <option value="automatic">אוטומט</option>
                                <option value="manual">ידני</option>
                            </Field>
                        </div>

                        <div className="form-group">
                            <label>סוג דלק:</label>
                            <Field as="select" name="fuelType" className="form-control">
                                <option value="fuel">בנזין/סולר</option>
                                <option value="hybrid">היברידי</option>
                                <option value="electric">חשמלי</option>
                            </Field>
                        </div>

                        {values.fuelType !== "electric" && (
                            <div className="form-group">
                                <label>צריכת דלק (ל-100 ק"מ):</label>
                                <Field name="fuelConsumption" type="number" className="form-control" />
                                <ErrorMessage name="fuelConsumption" component="span" className="text-danger" />
                            </div>
                        )}

                        <div className="form-group">
                            <label>מחיר ליום:</label>
                            <Field name="priceToDay" type="number" className="form-control" />
                            <ErrorMessage name="priceToDay" component="span" className="text-danger" />
                        </div>

                        <div className="form-group">
                            <label>קישור לתמונה:</label>
                            <Field name="imageUrl" className="form-control" />
                            <ErrorMessage name="imageUrl" component="span" className="text-danger" />
                        </div>

                        <button type="submit" className="btn btn-primary mt-3">הוסף רכב</button>
                    </Form>
                )}
            </Formik>
        </div>
    );

}