import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import type { CombustionCar, ElectricCar } from "../Models/car"
import { useLocation } from 'react-router-dom';
import axios from "axios";
import type { Car } from '../Models/car';
import "./AddNewCar.css"
import Swal from 'sweetalert2';
type CarFormValues =
    | Omit<ElectricCar, "id">
    | Omit<CombustionCar, "id">;
const NewCar: React.FC = () => {
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
    const initialValues: CarFormValues = {
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
                navigate("/cars");
            }
            else {
                const carToSend = {
                    ...values,
                    id: `c${Date.now()}`,
                    availability: values.availability || new Array(60).fill(false)
                };
                const response = await axios.post("http://localhost:3000/cars", carToSend);
                if (response.status === 201) {
                    Swal.fire({
                        title: '!הרכב נוסף בהצלחה',
                        html: `
        <div style="text-align: center; ">
            <img src="/public/Image/Logo- DRIVON.png" alt="Blue Car" class="swal-car-animation" style="width: 150px; margin-bottom: 10px; background-color: #0056b3:">
            <p>  DRIVON הרכב החדש נוסף לקטלוג המכוניות של </p>
        </div>
    `,
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false,

                        confirmButtonColor: '#0076ff',
                        target: 'body',
                        customClass: {
                            popup: 'my-swal-car-added-popup'
                        }
                    }).then(() => {
                        navigate('/cars');
                    });
                    resetForm();

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
        <div className="login-overlay"> 
            <div className="register-modal-frame"> 
                <div className="form-section-white"> 

                    <button className="close-btn-dark" onClick={() => navigate("/")}>×</button>

                    <div className="form-inner">
                        <h3>{carToEdit ? "עריכת רכב" : "הוספת רכב חדש"}</h3>

                        <Formik<CarFormValues>
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ values, setFieldValue }) => (
                                <Form>
                                    <div className="input-group">
                                        <label>חברה:</label>
                                        <Field name="company" placeholder="שם החברה" />
                                        <ErrorMessage name="company" component="span" className="error-text" />
                                    </div>

                                    <div className="input-group-row">
                                        <div className="input-group">
                                            <label>שנה:</label>
                                            <Field name="year" type="number" />
                                            <ErrorMessage name="year" component="span" className="error-text" />
                                        </div>
                                        <div className="input-group">
                                            <label>צבע:</label>
                                            <Field name="color" />
                                            <ErrorMessage name="color" component="span" className="error-text" />
                                        </div>
                                    </div>

                                    <div className="input-group-row">
                                        <div className="input-group">
                                            <label>מושבים:</label>
                                            <Field name="placeNumber" type="number" />
                                        </div>
                                        <div className="input-group">
                                            <label>גיר:</label>
                                            <Field as="select" name="gearType">
                                                <option value="automatic">אוטומט</option>
                                                <option value="manual">ידני</option>
                                            </Field>
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label>סוג דלק:</label>
                                        <Field as="select" name="fuelType">
                                            <option value="fuel">בנזין/סולר</option>
                                            <option value="hybrid">היברידי</option>
                                            <option value="electric">חשמלי</option>
                                        </Field>
                                    </div>

                                    {values.fuelType !== "electric" && (
                                        <div className="input-group">
                                            <label>צריכת דלק:</label>
                                            <Field name="fuelConsumption" type="number" />
                                            <ErrorMessage name="fuelConsumption" component="span" className="error-text" />
                                        </div>
                                    )}

                                    <div className="input-group">
                                        <label>מחיר ליום:</label>
                                        <Field name="priceToDay" type="number" />
                                        <ErrorMessage name="priceToDay" component="span" className="error-text" />
                                    </div>

                                    <div className="input-group">
                                        <label className="file-upload-label">
                                            <span>📷 בחר תמונה</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                hidden
                                                onChange={(event) => {
                                                    const file = event.currentTarget.files?.[0];
                                                    if (file) setFieldValue("imageUrl", `/Image/${file.name}`);
                                                }}
                                            />
                                        </label>
                                        <ErrorMessage name="imageUrl" component="span" className="error-text" />
                                    </div>

                                    <button type="submit" className="login-submit-btn">
                                        {carToEdit ? "עדכן רכב" : "שמור רכב חדש"}
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    );

}
export default NewCar;