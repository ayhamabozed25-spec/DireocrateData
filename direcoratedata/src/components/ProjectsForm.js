import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import MapPicker from "./MapPicker";

export default function ProjectsForm() {
  const [location, setLocation] = useState(null);

  // البحث
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // تنفيذ البحث عند تغيير النص
  useEffect(() => {
    const fetchProjects = async () => {
      if (searchTerm.trim() === "") {
        setSearchResults([]);
        return;
      }

      const snapshot = await getDocs(collection(db, "projects"));
      const filtered = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((project) =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.details.toLowerCase().includes(searchTerm.toLowerCase())
        );

      setSearchResults(filtered);
    };

    fetchProjects();
  }, [searchTerm]);

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

      {/* حقل البحث */}
      <Form.Group className="mb-4">
        <Form.Label className="fw-bold">🔎 البحث في المشاريع السابقة</Form.Label>
        <Form.Control
          type="text"
          placeholder="أدخل اسم المشروع أو كلمة مفتاحية"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      {/* نتائج البحث */}
      {searchResults.length > 0 && (
        <div className="mb-4">
          <h5 className="text-primary">نتائج البحث:</h5>
          <ul className="list-group shadow-sm">
            {searchResults.map((project) => (
              <li key={project.id} className="list-group-item">
                <strong>{project.name}</strong>
                <br />
                <small className="text-muted">{project.details}</small>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* باقي النموذج */}
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
