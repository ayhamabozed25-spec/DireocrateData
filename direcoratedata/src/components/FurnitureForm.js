import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button } from "react-bootstrap";

export default function FurnitureForm() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "furniture"), {
      employee: e.target.employee.value,
      type: e.target.type.value,
      costPerUnit: e.target.costPerUnit.value,
      quantity: e.target.quantity.value,
      status: e.target.status.value,
      problem: e.target.problem.value,
      need: e.target.need.value,
    });
    alert("تم حفظ الأثاث ✅");
    e.target.reset();
  };

  return (
    <Form onSubmit={handleSubmit} className="p-3">
      <Form.Group><Form.Label>الموظف</Form.Label><Form.Control name="employee" /></Form.Group>
      <Form.Group><Form.Label>نوع الأثاث</Form.Label><Form.Control name="type" /></Form.Group>
      <Form.Group><Form.Label>الكلفة للوحدة</Form.Label><Form.Control type="number" name="costPerUnit" /></Form.Group>
      <Form.Group><Form.Label>الكمية</Form.Label><Form.Control type="number" name="quantity" /></Form.Group>
      <Form.Group><Form.Label>الحالة</Form.Label><Form.Control name="status" /></Form.Group>
      <Form.Group><Form.Label>المشكلة</Form.Label><Form.Control name="problem" /></Form.Group>
      <Form.Group><Form.Label>الحاجة</Form.Label><Form.Control name="need" /></Form.Group>
      <Button type="submit" className="mt-3">حفظ الأثاث</Button>
    </Form>
  );
}
