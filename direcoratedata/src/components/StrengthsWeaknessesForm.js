import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button } from "react-bootstrap";

export default function StrengthsWeaknessesForm() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "swot"), {
      type: e.target.type.value, // قوة / ضعف / فرصة / خطر
      description: e.target.description.value,
      priority: e.target.priority.value,
    });
    alert("تم حفظ العنصر ✅");
    e.target.reset();
  };

  return (
    <Form onSubmit={handleSubmit} className="p-3">
      <Form.Group><Form.Label>النوع</Form.Label><Form.Control name="type" placeholder="قوة / ضعف / فرصة / خطر" /></Form.Group>
      <Form.Group><Form.Label>الوصف</Form.Label><Form.Control name="description" /></Form.Group>
      <Form.Group><Form.Label>الأولوية</Form.Label><Form.Control type="number" name="priority" /></Form.Group>
      <Button type="submit" className="mt-3">حفظ</Button>
    </Form>
  );
}
