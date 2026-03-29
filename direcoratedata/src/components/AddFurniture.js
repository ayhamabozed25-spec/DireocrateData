import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import Select from "react-select";

export default function AddFurniture() {
  const [employees, setEmployees] = useState([]);

  const [need, setNeed] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      const snapshot = await getDocs(collection(db, "employees"));
      const data = snapshot.docs.map(doc => ({
        value: doc.data().name,
        label: doc.data().name
      }));
      setEmployees(data);
    };
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "furniture"), {
      need,
      type: type === "أخرى" ? e.target.otherType.value : type,
      costPerUnit: need === "مطلوب" ? null : parseFloat(e.target.costPerUnit.value),
      quantity: parseInt(e.target.quantity.value),
      employee: need === "مطلوب" ? null : e.target.employee.value,
      status: need === "مطلوب" ? null : status,
      problem: status === "بحاجة صيانة" ? e.target.problem.value : null,
    });

    alert("تم حفظ الأثاث بنجاح");
    e.target.reset();
    setNeed("");
    setType("");
    setStatus("");
  };

  return (
    <div className="p-3">
      <h3>إضافة أثاث جديد</h3>

      <Form onSubmit={handleSubmit}>

        {/* الحاجة */}
        <Form.Group>
          <Form.Label>الحاجة</Form.Label>
          <Form.Select value={need} onChange={(e) => setNeed(e.target.value)} required>
            <option value="">اختر</option>
            <option value="متوفر">متوفر</option>
            <option value="مطلوب">مطلوب</option>
          </Form.Select>
        </Form.Group>

        {/* النوع */}
        <Form.Group>
          <Form.Label>نوع الأثاث</Form.Label>
          <Form.Select value={type} onChange={(e) => setType(e.target.value)} required>
            <option value="">اختر</option>
            <option value="طاولة مكتب">طاولة مكتب</option>
            <option value="كرسي مكتب">كرسي مكتب</option>
            <option value="طاولة اجتماعات">طاولة اجتماعات</option>
            <option value="أريكة">أريكة</option>
            <option value="خزانة ملفات">خزانة ملفات</option>
            <option value="مكتبة">مكتبة</option>
            <option value="أخرى">أخرى</option>
          </Form.Select>
        </Form.Group>

        {type === "أخرى" && (
          <Form.Group>
            <Form.Label>نوع آخر</Form.Label>
            <Form.Control name="otherType" required />
          </Form.Group>
        )}

        {/* الكمية */}
        <Form.Group>
          <Form.Label>الكمية</Form.Label>
          <Form.Control type="number" name="quantity" min="1" required />
        </Form.Group>

        {/* الموظف */}
        {need === "متوفر" && (
          <Form.Group>
            <Form.Label>الموظف</Form.Label>
            <Select options={employees} name="employee" placeholder="اختر الموظف" isSearchable />
          </Form.Group>
        )}

        {/* الكلفة */}
        {need === "متوفر" && (
          <Form.Group>
            <Form.Label>الكلفة للوحدة</Form.Label>
            <Form.Control type="number" step="0.01" name="costPerUnit" required />
          </Form.Group>
        )}

        {/* الحالة */}
        {need === "متوفر" && (
          <Form.Group>
            <Form.Label>الحالة</Form.Label>
            <Form.Select value={status} onChange={(e) => setStatus(e.target.value)} required>
              <option value="">اختر</option>
              <option value="جيد جدا">جيد جدا</option>
              <option value="جيد">جيد</option>
              <option value="بحاجة صيانة">بحاجة صيانة</option>
            </Form.Select>
          </Form.Group>
        )}

        {/* المشكلة */}
        {status === "بحاجة صيانة" && (
          <Form.Group>
            <Form.Label>المشكلة</Form.Label>
            <Form.Control name="problem" required />
          </Form.Group>
        )}

        <Button type="submit" className="mt-3">حفظ الأثاث</Button>
      </Form>
    </div>
  );
}
