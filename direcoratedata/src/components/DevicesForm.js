import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import Select from "react-select";

export default function DevicesForm() {
  const [employees, setEmployees] = useState([]);
  const [devices, setDevices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // جلب الموظفين من قاعدة البيانات
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

  // جلب الأجهزة من قاعدة البيانات
  useEffect(() => {
    const fetchDevices = async () => {
      const snapshot = await getDocs(collection(db, "devices"));
      setDevices(snapshot.docs.map(doc => doc.data()));
    };
    fetchDevices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "devices"), {
      employee: e.target.employee.value,
      type: e.target.type.value,
      brand: e.target.brand.value,
      model: e.target.model.value,
      description: e.target.description.value,
      purchaseDate: e.target.purchaseDate.value,
      cost: e.target.cost.value,
      status: e.target.status.value,
      breakdown: e.target.breakdown.value,
      effect: e.target.effect.value,
      priority: e.target.priority.value,
      notes: e.target.notes.value,
      need: e.target.need.value,
    });
    alert("تم حفظ الجهاز ✅");
    e.target.reset();
  };

  // فلترة الأجهزة حسب البحث
  const filteredDevices = devices.filter(dev =>
    dev.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dev.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dev.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-3">
      <h3>إضافة جهاز جديد</h3>

      {/* زر البحث عن الأجهزة */}
      <Form.Group className="mb-3">
        <Form.Label>بحث عن جهاز</Form.Label>
        <Form.Control
          type="text"
          placeholder="أدخل نوع الجهاز أو الشركة أو الموديل"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      {/* عرض نتائج البحث */}
      {searchTerm && (
        <ul>
          {filteredDevices.map((dev, index) => (
            <li key={index}>
              {dev.type} - {dev.brand} - {dev.model} - الموظف: {dev.employee}
            </li>
          ))}
        </ul>
      )}

      {/* نموذج إضافة جهاز */}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>الموظف</Form.Label>
          <Select
            options={employees}
            name="employee"
            placeholder="اختر الموظف"
            isSearchable
          />
        </Form.Group>

        <Form.Group><Form.Label>نوع الجهاز</Form.Label><Form.Control name="type" /></Form.Group>
        <Form.Group><Form.Label>الشركة</Form.Label><Form.Control name="brand" /></Form.Group>
        <Form.Group><Form.Label>الموديل</Form.Label><Form.Control name="model" /></Form.Group>
        <Form.Group><Form.Label>الوصف</Form.Label><Form.Control name="description" /></Form.Group>
        <Form.Group><Form.Label>تاريخ الشراء</Form.Label><Form.Control type="date" name="purchaseDate" /></Form.Group>
        <Form.Group><Form.Label>الكلفة</Form.Label><Form.Control type="number" name="cost" /></Form.Group>
        <Form.Group><Form.Label>الحالة</Form.Label><Form.Control name="status" /></Form.Group>
        <Form.Group><Form.Label>وصف العطل</Form.Label><Form.Control name="breakdown" /></Form.Group>
        <Form.Group><Form.Label>التأثير على الخدمة</Form.Label><Form.Control name="effect" /></Form.Group>
        <Form.Group><Form.Label>أولوية الإصلاح</Form.Label><Form.Control name="priority" /></Form.Group>
        <Form.Group><Form.Label>ملاحظات</Form.Label><Form.Control name="notes" /></Form.Group>
        <Form.Group><Form.Label>الحاجة</Form.Label><Form.Control name="need" /></Form.Group>

        <Button type="submit" className="mt-3">حفظ الجهاز</Button>
      </Form>
    </div>
  );
}
