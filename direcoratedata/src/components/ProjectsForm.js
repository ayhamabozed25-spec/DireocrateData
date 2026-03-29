import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useState } from "react";
import MapPicker from "./MapPicker";

export default function ProjectsForm() {
  const [location, setLocation] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location) {
      alert("الرجاء اختيار موقع من الخريطة");
      return;
    }

    await addDoc(collection(db, "projects"), {
      name: e.target.name.value,
      details: e.target.details.value,
      startDate: e.target.startDate.value,
      endDate: e.target.endDate.value,
      budget: parseFloat(e.target.budget.value).toFixed(2),
      currency: e.target.currency.value,
      location: {
        lat: location.lat,
        lng: location.lng
      }
    });

    alert("تم حفظ المشروع بنجاح");
    e.target.reset();
    setLocation(null);
  };

  return (
    <Form onSubmit={handleSubmit} className="p-3">

      <Form.Group className="mb-3">
        <Form.Label>اسم المشروع</Form.Label>
        <Form.Control name="name" required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>تفاصيل المشروع</Form.Label>
        <Form.Control name="details" required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>اختر الموقع على الخريطة</Form.Label>
        <MapPicker onSelect={setLocation} />
        {location && (
          <div className="mt-2 text-success">
            تم اختيار الموقع: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
          </div>
        )}
      </Form.Group>

      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>تاريخ البدء</Form.Label>
            <Form.Control type="date" name="startDate" required />
          </Form.Group>
        </Col>

        <Col>
          <Form.Group className="mb-3">
            <Form.Label>تاريخ الانتهاء</Form.Label>
            <Form.Control type="date" name="endDate" required />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Form.Group className="mb-3">
            <Form.Label>الميزانية</Form.Label>
            <Form.Control
              type="number"
              name="budget"
              required
              step="0.01"
              min="0"
            />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>العملة</Form.Label>
            <Form.Select name="currency" required>
              <option value="USD">دولار أمريكي</option>
              <option value="SYP">ليرة سورية</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Button type="submit" className="w-100">
        حفظ المشروع
      </Button>
    </Form>
  );
}
