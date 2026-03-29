import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button } from "react-bootstrap";
import { useState } from "react";

export default function AddSwot() {
  const [type, setType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "swot"), {
      type: e.target.type.value,
      description: e.target.description.value,
      priority: e.target.priority.value,
    });

    alert("تم حفظ العنصر بنجاح");
    e.target.reset();
    setType("");
  };

  return (
    <div className="p-3">
      <h3>إضافة عنصر SWOT</h3>

      <Form onSubmit={handleSubmit}>

        {/* النوع */}
        <Form.Group className="mb-3">
          <Form.Label>النوع *</Form.Label>
          <Form.Select name="type" required value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">اختر النوع</option>
            <option value="قوة">قوة</option>
            <option value="ضعف">ضعف</option>
            <option value="فرصة">فرصة</option>
            <option value="خطر">خطر</option>
          </Form.Select>
        </Form.Group>

        {/* الوصف */}
        <Form.Group className="mb-3">
          <Form.Label>الوصف *</Form.Label>
          <Form.Control name="description" required />
        </Form.Group>

        {/* درجة الأهمية */}
        <Form.Group className="mb-3">
          <Form.Label>درجة الأهمية (1 - 5) *</Form.Label>
          <Form.Control type="number" name="priority" min="1" max="5" required />
        </Form.Group>

        <Button type="submit" className="w-100 mt-3">حفظ</Button>
      </Form>
    </div>
  );
}
