import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button } from "react-bootstrap";

export default function DepartmentsForm() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "departments"), {
      name: e.target.name.value,
      head: e.target.head.value,
    });
    alert("تم حفظ القسم ✅");
    e.target.reset();
  };

  return (
    <Form onSubmit={handleSubmit} className="p-3">
      <Form.Group>
        <Form.Label>اسم القسم</Form.Label>
        <Form.Control name="name" />
      </Form.Group>
      <Form.Group>
        <Form.Label>رئيس القسم</Form.Label>
        <Form.Control name="head" />
      </Form.Group>
      <Button type="submit" className="mt-3">حفظ القسم</Button>
    </Form>
  );
}
