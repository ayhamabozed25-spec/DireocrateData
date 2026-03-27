import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button } from "react-bootstrap";

export default function ProjectChallengesForm() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "projectChallenges"), {
      project: e.target.project.value,
      category: e.target.category.value,
      riskDescription: e.target.riskDescription.value,
      probability: e.target.probability.value,
      impact: e.target.impact.value,
      suggestion: e.target.suggestion.value,
    });
    alert("تم حفظ التحدي ✅");
    e.target.reset();
  };

  return (
    <Form onSubmit={handleSubmit} className="p-3">
      <Form.Group><Form.Label>اسم المشروع</Form.Label><Form.Control name="project" /></Form.Group>
      <Form.Group><Form.Label>الفئة</Form.Label><Form.Control name="category" /></Form.Group>
      <Form.Group><Form.Label>وصف الخطر</Form.Label><Form.Control name="riskDescription" /></Form.Group>
      <Form.Group><Form.Label>الاحتمالية</Form.Label><Form.Control name="probability" /></Form.Group>
      <Form.Group><Form.Label>التأثير</Form.Label><Form.Control name="impact" /></Form.Group>
      <Form.Group><Form.Label>الحل المقترح</Form.Label><Form.Control name="suggestion" /></Form.Group>
      <Button type="submit" className="mt-3">حفظ التحدي</Button>
    </Form>
  );
}
