import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button } from "react-bootstrap";

export default function DevicesForm() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "devices"), {
      employee: e.target.employee.value,
      type: e.target.type.value,
      brand: e.target.brand.value,
      model: e.target.model.value,
      description: e.target.description.value,
      purchaseDate: e.target.purchaseDate.value,
      cost: e.target.cost.value,
      status: e.target.status.value,
      breakdown: e.target.breakdown.value,
      effect: e.target.effect.value,
      priority: e.target.priority.value,
      notes: e.target.notes.value,
      need: e.target.need.value,
    });
    alert("تم حفظ الجهاز ✅");
    e.target.reset();
  };

  return (
    <Form onSubmit={handleSubmit} className="p-3">
      <Form.Group><Form.Label>الموظف</Form.Label><Form.Control name="employee" /></Form.Group>
      <Form.Group><Form.Label>نوع الجهاز</Form.Label><Form.Control name="type" /></Form.Group>
      <Form.Group><Form.Label>الشركة</Form.Label><Form.Control name="brand" /></Form.Group>
      <Form.Group><Form.Label>الموديل</Form.Label><Form.Control name="model" /></Form.Group>
      <Form.Group><Form.Label>الوصف</Form.Label><Form.Control name="description" /></Form.Group>
      <Form.Group><Form.Label>تاريخ الشراء</Form.Label><Form.Control type="date" name="purchaseDate" /></Form.Group>
      <Form.Group><Form.Label>الكلفة</Form.Label><Form.Control type="number" name="cost" /></Form.Group>
      <Form.Group><Form.Label>الحالة</Form.Label><Form.Control name="status" /></Form.Group>
      <Form.Group><Form.Label>وصف العطل</Form.Label><Form.Control name="breakdown" /></Form.Group>
      <Form.Group><Form.Label>التأثير على الخدمة</Form.Label><Form.Control name="effect" /></Form.Group>
      <Form.Group><Form.Label>أولوية الإصلاح</Form.Label><Form.Control name="priority" /></Form.Group>
      <Form.Group><Form.Label>ملاحظات</Form.Label><Form.Control name="notes" /></Form.Group>
      <Form.Group><Form.Label>الحاجة</Form.Label><Form.Control name="need" /></Form.Group>
      <Button type="submit" className="mt-3">حفظ الجهاز</Button>
    </Form>
  );
}
