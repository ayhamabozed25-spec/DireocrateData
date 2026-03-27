import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button } from "react-bootstrap";

export default function DivisionsForm() {
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

  return (
    <Form onSubmit={handleSubmit} className="p-3">
      <Form.Group><Form.Label>اسم الشعبة</Form.Label><Form.Control name="name" /></Form.Group>
      <Form.Group><Form.Label>القسم التابع له</Form.Label><Form.Control name="department" /></Form.Group>
      <Form.Group><Form.Label>رئيس الشعبة</Form.Label><Form.Control name="head" /></Form.Group>
      <Button type="submit" className="mt-3">حفظ الشعبة</Button>
    </Form>
  );
}
