import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button } from "react-bootstrap";

export default function ServicesForm() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "services"), {
      name: e.target.name.value,
      details: e.target.details.value,
      target: e.target.target.value,
      condition: e.target.condition.value,
      otherInstitution: e.target.otherInstitution.value,
      reason: e.target.reason.value,
      gettingService: e.target.gettingService.value,
      cost: e.target.cost.value,
      timeCost: e.target.timeCost.value,
      output: e.target.output.value,
      beneficiaries: e.target.beneficiaries.value,
    });
    alert("تم حفظ الخدمة ✅");
    e.target.reset();
  };

  return (
    <Form onSubmit={handleSubmit} className="p-3">
      <Form.Group><Form.Label>اسم الخدمة</Form.Label><Form.Control name="name" /></Form.Group>
      <Form.Group><Form.Label>تفاصيل الخدمة</Form.Label><Form.Control name="details" /></Form.Group>
      <Form.Group><Form.Label>المستهدف</Form.Label><Form.Control name="target" /></Form.Group>
      <Form.Group><Form.Label>حالة الخدمة</Form.Label><Form.Control name="condition" /></Form.Group>
      <Form.Group><Form.Label>مؤسسة أخرى</Form.Label><Form.Control name="otherInstitution" /></Form.Group>
      <Form.Group><Form.Label>السبب</Form.Label><Form.Control name="reason" /></Form.Group>
      <Form.Group><Form.Label>طريقة الحصول</Form.Label><Form.Control name="gettingService" /></Form.Group>
      <Form.Group><Form.Label>الكلفة</Form.Label><Form.Control type="number" name="cost" /></Form.Group>
      <Form.Group><Form.Label>الكلفة الزمنية</Form.Label><Form.Control name="timeCost" /></Form.Group>
      <Form.Group><Form.Label>المخرجات</Form.Label><Form.Control name="output" /></Form.Group>
      <Form.Group><Form.Label>متوسط المستفيدين شهريًا</Form.Label><Form.Control type="number" name="beneficiaries" /></Form.Group>
      <Button type="submit" className="mt-3">حفظ الخدمة</Button>
    </Form>
  );
}
