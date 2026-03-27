import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import Select from "react-select";

export default function CarsForm() {
  const [employees, setEmployees] = useState([]);
  const [cars, setCars] = useState([]);
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

  // جلب الآليات من قاعدة البيانات
  useEffect(() => {
    const fetchCars = async () => {
      const snapshot = await getDocs(collection(db, "cars"));
      setCars(snapshot.docs.map(doc => doc.data()));
    };
    fetchCars();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "cars"), {
      employee: e.target.employee.value,
      type: e.target.type.value,
      name: e.target.name.value,
      status: e.target.status.value,
      breakdown: e.target.breakdown.value,
      effect: e.target.effect.value,
      priority: e.target.priority.value,
      need: e.target.need.value,
    });
    alert("تم حفظ الآلية ✅");
    e.target.reset();
  };

  // فلترة الآليات حسب البحث
  const filteredCars = cars.filter(car =>
    car.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-3">
      <h3>إضافة آلية جديدة</h3>

      {/* زر البحث عن الآليات */}
      <Form.Group className="mb-3">
        <Form.Label>بحث عن آلية</Form.Label>
        <Form.Control
          type="text"
          placeholder="أدخل اسم الآلية"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      {/* عرض نتائج البحث */}
      {searchTerm && (
        <ul>
          {filteredCars.map((car, index) => (
            <li key={index}>
              {car.name} - الموظف: {car.employee} - الحالة: {car.status}
            </li>
          ))}
        </ul>
      )}

      {/* نموذج إضافة آلية */}
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

        <Form.Group><Form.Label>نوع الآلية</Form.Label><Form.Control name="type" /></Form.Group>
        <Form.Group><Form.Label>اسم الآلية</Form.Label><Form.Control name="name" /></Form.Group>
        <Form.Group><Form.Label>الحالة</Form.Label><Form.Control name="status" /></Form.Group>
        <Form.Group><Form.Label>سبب العطل</Form.Label><Form.Control name="breakdown" /></Form.Group>
        <Form.Group><Form.Label>التأثير على الخدمة</Form.Label><Form.Control name="effect" /></Form.Group>
        <Form.Group><Form.Label>أولوية الإصلاح</Form.Label><Form.Control name="priority" /></Form.Group>
        <Form.Group><Form.Label>الحاجة</Form.Label><Form.Control name="need" /></Form.Group>

        <Button type="submit" className="mt-3">حفظ الآلية</Button>
      </Form>
    </div>
  );
}
