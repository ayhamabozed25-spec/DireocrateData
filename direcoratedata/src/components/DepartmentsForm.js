import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import Select from "react-select";

export default function DepartmentsForm() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
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

  // جلب الأقسام من قاعدة البيانات
  useEffect(() => {
    const fetchDepartments = async () => {
      const snapshot = await getDocs(collection(db, "departments"));
      setDepartments(snapshot.docs.map(doc => doc.data()));
    };
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "departments"), {
      name: e.target.name.value,
      head: e.target.head.value,
    });
    alert("تم حفظ القسم ✅");
    e.target.reset();
  };

  // فلترة الأقسام حسب البحث
  const filteredDepartments = departments.filter(dep =>
    dep.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-3">
      <h3>إضافة قسم جديد</h3>

      {/* زر البحث عن الأقسام */}
      <Form.Group className="mb-3">
        <Form.Label>بحث عن قسم</Form.Label>
        <Form.Control
          type="text"
          placeholder="أدخل اسم القسم"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      {/* عرض نتائج البحث */}
      {searchTerm && (
        <ul>
          {filteredDepartments.map((dep, index) => (
            <li key={index}>{dep.name} - رئيس القسم: {dep.head}</li>
          ))}
        </ul>
      )}

      {/* نموذج إضافة قسم */}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>اسم القسم</Form.Label>
          <Form.Control name="name" />
        </Form.Group>

        <Form.Group>
          <Form.Label>رئيس القسم</Form.Label>
          {/* قائمة منسدلة ديناميكية للموظفين */}
          <Select
            options={employees}
            name="head"
            placeholder="اختر رئيس القسم"
            isSearchable
          />
        </Form.Group>

        <Button type="submit" className="mt-3">حفظ القسم</Button>
      </Form>
    </div>
  );
}
