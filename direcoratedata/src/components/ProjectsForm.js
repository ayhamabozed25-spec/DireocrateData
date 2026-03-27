import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button } from "react-bootstrap";

export default function ProjectsForm() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "projects"), {
      name: e.target.name.value,
      details: e.target.details.value,
      location: e.target.location.value,
      startDate: e.target.startDate.value,
      endDate: e.target.endDate.value,
      budget: e.target.budget.value,
      status: e.target.status.value,
    });
    alert("تم حفظ المشروع ✅");
    e.target.reset();
  };

  return (
    <Form onSubmit={handleSubmit} className="p-3">
      <Form.Group><Form.Label>اسم المشروع</Form.Label><Form.Control name="name" /></Form.Group>
      <Form.Group><Form.Label>تفاصيل المشروع</Form.Label><Form.Control name="details" /></Form.Group>
      <Form.Group><Form.Label>الموقع</Form.Label><Form.Control name="location" /></Form.Group>
      <Form.Group><Form.Label>تاريخ البدء</Form.Label><Form.Control type="date" name="startDate" /></Form.Group>
      <Form.Group><Form.Label>تاريخ الانتهاء</Form.Label><Form.Control type="date" name="endDate" /></Form.Group>
      <Form.Group><Form.Label>الميزانية</Form.Label><Form.Control type="number" name="budget"
