import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import type {  CombustionCar,ElectricCar} from "../Models/car"
import { useLocation } from 'react-router-dom';
import axios from "axios";
import type { Car } from '../Models/car';
import "./AddNewCar.css"

type CarFormValues =
  | Omit<ElectricCar, "id">
  | Omit<CombustionCar, "id">;
export default function NewCar() {
    const location = useLocation();
    const carToEdit = location.state?.car as Car | undefined;
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
       imageUrl: Yup.string().required("יש לבחור תמונה"),
        fuelConsumption: Yup.number().when("fuelType", {
            is: (val: string) => val !== "electric",
            then: (schema) => schema.required("יש למלא צריכת דלק").min(0, "לא יכול להיות שלילי"),
            otherwise: (schema) => schema.notRequired(),
        }),
    })
 const initialValues:  CarFormValues = {
     company: carToEdit?.company || "",
    year: carToEdit?.year || new Date().getFullYear(),
    color: carToEdit?.color || "",
    placeNumber: carToEdit?.placeNumber || 5,
    gearType: carToEdit?.gearType || "automatic",
    priceToDay: carToEdit?.priceToDay || 0,
    imageUrl: carToEdit?.imageUrl || "",
    fuelType: carToEdit?.fuelType || "fuel",
    fuelConsumption: (carToEdit as CombustionCar)?.fuelConsumption || 0,
    availability: carToEdit?.availability || new Array(60).fill(false),
    };

    const handleSubmit = async (values: CarFormValues, { setSubmitting, resetForm }: FormikHelpers<CarFormValues>) => {
        console.log("נתוני הרכב החדש:", values);
        try {
             if (carToEdit?.id) {
            await axios.put(`http://localhost:3000/cars/${carToEdit.id}`, {
                ...values,
                id: carToEdit.id 
            });
            alert("הרכב עודכן בהצלחה!");
        }
else{
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
}
      

        } catch (error) {
            console.error("שגיאה בהוספת הרכב:", error);
            alert("אופס! הייתה שגיאה בחיבור לשרת");
        } finally {
            setSubmitting(false); 
        }
   

    };
    return (
        <div className="container">
          <h1>{carToEdit ? "עריכת רכב" : "הוספת רכב חדש"}</h1>
            
            <Formik<CarFormValues>
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
               {({ values, setFieldValue }) => (
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
    <label>בחירת תמונה מהמחשב:</label>
    <input
        type="file"
        accept="image/*"
        className="form-control"
        onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            if (file) {
                setFieldValue("imageUrl", `/Image/${file.name}`);
            }
        }}
    />
    
    {values.imageUrl && values.imageUrl.trim() !== "" && (
        <div className="mt-2 text-center">
            <img 
                src={values.imageUrl} 
                alt="preview" 
                onError={(e) => (e.currentTarget.style.display = "none")} 
            />
            <p className="text-muted" style={{ fontSize: "12px" }}>נתיב נבחר: {values.imageUrl}</p>
        </div>
    )}
    
    <ErrorMessage name="imageUrl" component="span" className="text-danger" />
</div>

                        <button type="submit" className="btn btn-primary mt-3">הוסף רכב</button>
                    </Form>
                )}
            </Formik>
        </div>
    );

}