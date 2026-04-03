import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import Select from "react-select";
import { useAuth } from "../components/AuthContext";

export default function AddDepartment() {
  const [employees, setEmployees] = useState([]);
  const [depName, setDepName] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!depName || !currentUser?.email) {
        setEmployees([]);
        return;
      }
      const q = query(
        collection(db, "employees"),
        where("department", "==", depName),
        where("managerEmail", "==", currentUser.email) // فلترة حسب المؤسسة
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        value: doc.data().name,
        label: doc.data().name
      }));
      setEmployees(data);
    };
    fetchEmployees();
  }, [depName, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const head = e.target.head.value;

    if (!name) {
      alert("اسم القسم إلزامي ❌");
      return;
    }

    await addDoc(collection(db, "departments"), { 
      name, 
      head, 
      managerEmail: currentUser?.email
    });

    alert("تم حفظ القسم بنجاح");
    e.target.reset();
    setEmployees([]);
    setDepName("");
  };

  return (
    <div className="p-3">
      <h3>إضافة قسم جديد</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>اسم القسم</Form.Label>
          <Form.Control 
            name="name" 
            required 
            onChange={(e) => setDepName(e.target.value.trim())} 
          />
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
