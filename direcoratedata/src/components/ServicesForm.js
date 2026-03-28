import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button, ListGroup } from "react-bootstrap";

export default function ServicesForm() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

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

  const handleSearch = async () => {
    if (!searchTerm) return;
    const q = query(
      collection(db, "services"),
      where("name", ">=", searchTerm),
      where("name", "<=", searchTerm + "\uf8ff")
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setResults(data);
  };

  return (
    <div className="p-3">
      {/* نموذج إضافة خدمة */}
      <Form onSubmit={handleSubmit}>
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

      {/* البحث عن الخدمات السابقة */}
      <div className="mt-4">
        <Form.Group>
          <Form.Label>بحث عن خدمة</Form.Label>
          <Form.Control
            type="text"
            placeholder="أدخل اسم الخدمة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>
        <Button className="mt-2" onClick={handleSearch}>بحث</Button>

        {/* عرض النتائج */}
        <ListGroup className="mt-3">
          {results.map((service) => (
            <ListGroup.Item key={service.id}>
              <strong>{service.name}</strong> - {service.details}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </div>
  );
}
