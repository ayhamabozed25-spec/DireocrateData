import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button, Card, InputGroup, ListGroup } from "react-bootstrap";
import { useState, useEffect } from "react";
import Select from "react-select";

export default function DivisionsForm() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // جلب الموظفين
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

  // جلب الأقسام
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

  // جلب الشعب
  useEffect(() => {
    const fetchDivisions = async () => {
      const snapshot = await getDocs(collection(db, "divisions"));
      setDivisions(snapshot.docs.map(doc => doc.data()));
    };
    fetchDivisions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const department = e.target.department.value;
    const head = e.target.head.value;

    if (!name || !department) {
      alert("اسم الشعبة والقسم إلزاميان ❌");
      return;
    }

    await addDoc(collection(db, "divisions"), { name, department, head });
    alert("تم حفظ الشعبة ✅");
    e.target.reset();
  };

  // فلترة الشعب
  const filteredDivisions = divisions.filter(div =>
    div.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-3">
      <h3>إضافة شعبة جديدة</h3>

      {/* بطاقة البحث */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>🔍 البحث عن شعبة</Card.Title>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="أدخل اسم الشعبة"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="primary">بحث</Button>
          </InputGroup>

          {searchTerm && (
            <ListGroup className="mt-3">
              {filteredDivisions.map((div, index) => (
                <ListGroup.Item key={index}>
                  <strong>{div.name}</strong> - القسم: {div.department} - رئيس الشعبة: {div.head}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>

      {/* النموذج */}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>اسم الشعبة</Form.Label>
          <Form.Control name="name" required />
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
