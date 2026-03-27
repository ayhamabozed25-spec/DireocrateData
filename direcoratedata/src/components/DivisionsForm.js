import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import Select from "react-select";

export default function DivisionsForm() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [divisions, setDivisions] = useState([]);
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
      const data = snapshot.docs.map(doc => ({
        value: doc.data().name,
        label: doc.data().name
      }));
      setDepartments(data);
    };
    fetchDepartments();
  }, []);

  // جلب الشعب من قاعدة البيانات
  useEffect(() => {
    const fetchDivisions = async () => {
      const snapshot = await getDocs(collection(db, "divisions"));
      setDivisions(snapshot.docs.map(doc => doc.data()));
    };
    fetchDivisions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "divisions"), {
      name: e.target.name.value,
      department: e.target.department.value,
      head: e.target.head.value,
    });
    alert("تم حفظ الشعبة ✅");
    e.target.reset();
  };

  // فلترة الشعب حسب البحث
  const filteredDivisions = divisions.filter(div =>
    div.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-3">
      <h3>إضافة شعبة جديدة</h3>

      {/* زر البحث عن الشعب */}
      <Form.Group className="mb-3">
        <Form.Label>بحث عن شعبة</Form.Label>
        <Form.Control
          type="text"
          placeholder="أدخل اسم الشعبة"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      {/* عرض نتائج البحث */}
      {searchTerm && (
        <ul>
          {filteredDivisions.map((div, index) => (
            <li key={index}>
              {div.name} - القسم: {div.department} - رئيس الشعبة: {div.head}
            </li>
          ))}
        </ul>
      )}

      {/* نموذج إضافة شعبة */}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>اسم الشعبة</Form.Label>
          <Form.Control name="name" />
        </Form.Group>

        <Form.Group>
          <Form.Label>القسم التابع له</Form.Label>
          <Select
            options={departments}
            name="department"
            placeholder="اختر القسم"
            isSearchable
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>رئيس الشعبة</Form.Label>
          <Select
            options={employees}
            name="head"
            placeholder="اختر رئيس الشعبة"
            isSearchable
          />
        </Form.Group>

        <Button type="submit" className="mt-3">حفظ الشعبة</Button>
      </Form>
    </div>
  );
}
