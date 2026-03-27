import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import Select from "react-select";

export default function FurnitureForm() {
  const [employees, setEmployees] = useState([]);
  const [furniture, setFurniture] = useState([]);
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

  // جلب الأثاث من قاعدة البيانات
  useEffect(() => {
    const fetchFurniture = async () => {
      const snapshot = await getDocs(collection(db, "furniture"));
      setFurniture(snapshot.docs.map(doc => doc.data()));
    };
    fetchFurniture();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "furniture"), {
      employee: e.target.employee.value,
      type: e.target.type.value,
      costPerUnit: e.target.costPerUnit.value,
      quantity: e.target.quantity.value,
      status: e.target.status.value,
      problem: e.target.problem.value,
      need: e.target.need.value,
    });
    alert("تم حفظ الأثاث ✅");
    e.target.reset();
  };

  // فلترة الأثاث حسب البحث
  const filteredFurniture = furniture.filter(item =>
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-3">
      <h3>إضافة أثاث جديد</h3>

      {/* زر البحث عن الأثاث */}
      <Form.Group className="mb-3">
        <Form.Label>بحث عن أثاث</Form.Label>
        <Form.Control
          type="text"
          placeholder="أدخل نوع الأثاث"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      {/* عرض نتائج البحث */}
      {searchTerm && (
        <ul>
          {filteredFurniture.map((item, index) => (
            <li key={index}>
              {item.type} - الموظف: {item.employee} - الحالة: {item.status}
            </li>
          ))}
        </ul>
      )}

      {/* نموذج إضافة أثاث */}
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

        <Form.Group><Form.Label>نوع الأثاث</Form.Label><Form.Control name="type" /></Form.Group>
        <Form.Group><Form.Label>الكلفة للوحدة</Form.Label><Form.Control type="number" name="costPerUnit" /></Form.Group>
        <Form.Group><Form.Label>الكمية</Form.Label><Form.Control type="number" name="quantity" /></Form.Group>
        <Form.Group><Form.Label>الحالة</Form.Label><Form.Control name="status" /></Form.Group>
        <Form.Group><Form.Label>المشكلة</Form.Label><Form.Control name="problem" /></Form.Group>
        <Form.Group><Form.Label>الحاجة</Form.Label><Form.Control name="need" /></Form.Group>

        <Button type="submit" className="mt-3">حفظ الأثاث</Button>
      </Form>
    </div>
  );
}
