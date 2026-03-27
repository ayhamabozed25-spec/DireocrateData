import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button } from "react-bootstrap";

export default function CarsForm() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "cars"), {
      employee: e.target.employee.value,
      type: e.target.type.value,
      name: e.target.name.value,
      status: e.target.status.value,
      breakdown: e.target.breakdown.value,
      effect: e.target.effect.value,
      priority: e.target.priority.value,
      need: e.target.need.value,
    });
    alert("تم حفظ الآلية ✅");
    e.target.reset();
  };

  return (
    <Form onSubmit={handleSubmit} className="p-3">
      <Form.Group><Form.Label>الموظف</Form.Label><Form.Control name="employee" /></Form.Group>
      <Form.Group><Form.Label>نوع الآلية</Form.Label><Form.Control name="type" /></Form.Group>
      <Form.Group><Form.Label>اسم الآلية</Form.Label><Form.Control name="name" /></Form.Group>
      <Form.Group><Form.Label>الحالة</Form.Label><Form.Control name="status" /></Form.Group>
      <Form.Group><Form.Label>سبب العطل</Form.Label><Form.Control name="breakdown" /></Form.Group>
      <Form.Group><Form.Label>التأثير على الخدمة</Form.Label><Form.Control name="effect" /></Form.Group>
      <Form.Group><Form.Label>أولوية الإصلاح</Form.Label><Form.Control name="priority" /></Form.Group>
      <Form.Group><Form.Label>الحاجة</Form.Label><Form.Control name="need" /></Form.Group>
      <Button type="submit" className="mt-3">حفظ الآلية</Button>
    </Form>
  );
}
