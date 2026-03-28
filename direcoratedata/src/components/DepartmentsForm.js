import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button, Card, InputGroup } from "react-bootstrap";
import { useState, useEffect } from "react";
import Select from "react-select";

export default function DepartmentsForm() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  useEffect(() => {
    const fetchDepartments = async () => {
      const snapshot = await getDocs(collection(db, "departments"));
      setDepartments(snapshot.docs.map(doc => doc.data()));
    };
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const head = e.target.head.value;

    if (!name) {
      alert("اسم القسم إلزامي ❌");
      return;
    }

    const exists = departments.some(dep => dep.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      alert("هذا القسم موجود مسبقًا ❌");
      return;
    }

    await addDoc(collection(db, "departments"), { name, head });
    alert("تم حفظ القسم ✅");
    e.target.reset();

    const snapshot = await getDocs(collection(db, "departments"));
    setDepartments(snapshot.docs.map(doc => doc.data()));
  };

  const filteredDepartments = departments.filter(dep =>
    dep.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-3">
      <h3>إضافة قسم جديد</h3>

      {/* بطاقة البحث */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>🔍 البحث عن قسم</Card.Title>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="أدخل اسم القسم"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="primary">بحث</Button>
          </InputGroup>

          {/* عرض نتائج البحث */}
          {searchTerm && (
            <ul className="mt-3">
              {filteredDepartments.map((dep, index) => (
                <li key={index}>{dep.name} - رئيس القسم: {dep.head}</li>
              ))}
            </ul>
          )}
        </Card.Body>
      </Card>

      {/* نموذج إضافة قسم */}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>اسم القسم</Form.Label>
          <Form.Control name="name" required />
        </Form.Group>

        <Form.Group>
          <Form.Label>رئيس القسم</Form.Label>
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
