import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import Select from "react-select";

export default function AddDivision() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);

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
      const data = snapshot.docs.map(doc => ({
        value: doc.data().name,
        label: doc.data().name
      }));
      setDepartments(data);
    };
    fetchDepartments();
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
    alert("تم حفظ الشعبة بنجاح");
    e.target.reset();
  };

  return (
    <div className="p-3">
      <h3>إضافة شعبة جديدة</h3>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>اسم الشعبة</Form.Label>
          <Form.Control name="name" required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>القسم التابع له</Form.Label>
          <Select
            options={departments}
            name="department"
            placeholder="اختر القسم"
            isSearchable
          />
        </Form.Group>

        <Form.Group className="mb-3">
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
