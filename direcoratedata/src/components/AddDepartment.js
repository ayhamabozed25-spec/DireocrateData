import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import Select from "react-select";
import { useAuth } from "./components/AuthContext"; // تأكد من المسار الصحيح

export default function AddDepartment() {
  const [employees, setEmployees] = useState([]);
  const { currentUser } = useAuth(); // جلب المستخدم الحالي

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

    const name = e.target.name.value.trim();
    const head = e.target.head.value;

    if (!name) {
      alert("اسم القسم إلزامي ❌");
      return;
    }

    // إضافة البريد الإلكتروني للمستخدم الحالي
    await addDoc(collection(db, "departments"), { 
      name, 
      head, 
      managerEmail: currentUser?.email // هذا هو المفتاح
    });

    alert("تم حفظ القسم بنجاح");
    e.target.reset();
  };

  return (
    <div className="p-3">
      <h3>إضافة قسم جديد</h3>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>اسم القسم</Form.Label>
          <Form.Control name="name" required />
        </Form.Group>

        <Form.Group className="mb-3">
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
