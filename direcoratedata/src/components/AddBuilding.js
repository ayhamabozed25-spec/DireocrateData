import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useState } from "react";
import MapPicker from "../components/MapPicker"; // تأكد من المسار الصحيح

export default function AddBuilding() {
  const [ownership, setOwnership] = useState("");
  const [structuralCondition, setStructuralCondition] = useState("");
  const [currency, setCurrency] = useState("دولار");
  const [location, setLocation] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "buildings"), {
      name: e.target.name.value,
      cost:
        ownership !== "بناء حكومي"
          ? {
              value: parseFloat(e.target.cost.value),
              currency,
            }
          : null,
      ownership: ownership === "أخرى" ? e.target.otherOwnership.value : ownership,
      floors: parseInt(e.target.floors.value),
      offices: parseInt(e.target.offices.value),
      capacity: parseInt(e.target.capacity.value),
      area: parseFloat(e.target.area.value),
      buildingDate: e.target.buildingDate.value,
      structuralCondition,
      riskLevel:
        structuralCondition === "بحاجة ترميم جزئي" ||
        structuralCondition === "بحاجة ترميم كلي"
          ? e.target.riskLevel.value
          : null,
      restorationDate:
        structuralCondition !== "جيد جدا"
          ? e.target.restorationDate.value
          : null,
      restorationDetails:
        structuralCondition === "مرمم حديثا"
          ? e.target.restorationDetails.value
          : null,
      fireAlarmSystem: e.target.fireAlarmSystem.value,
      fingerprintSystem: e.target.fingerprintSystem.value,
      location: location ? { lat: location.lat, lng: location.lng } : null,
    });

    alert("تم حفظ معلومات البناء بنجاح");
    e.target.reset();
    setOwnership("");
    setStructuralCondition("");
    setCurrency("دولار");
    setLocation(null);
  };

  return (
    <div className="p-3">
      <h3>إضافة بناء جديد</h3>

      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>اسم البناء</Form.Label>
          <Form.Control name="name" required />
        </Form.Group>

        <Form.Group>
          <Form.Label>الملكية</Form.Label>
          <Form.Select
            value={ownership}
            onChange={(e) => setOwnership(e.target.value)}
            required
          >
            <option value="">اختر</option>
            <option value="بناء حكومي">بناء حكومي</option>
            <option value="إيجار">إيجار</option>
            <option value="أخرى">أخرى</option>
          </Form.Select>
        </Form.Group>

        {ownership === "أخرى" && (
          <Form.Group>
            <Form.Label>نوع الملكية الأخرى</Form.Label>
            <Form.Control name="otherOwnership" required />
          </Form.Group>
        )}

        {ownership !== "بناء حكومي" && (
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>الكلفة</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="cost"
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>العملة</Form.Label>
                <Form.Select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="دولار">دولار</option>
                  <option value="ليرة سورية">ليرة سورية</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        )}

        <Form.Group>
          <Form.Label>عدد الطوابق</Form.Label>
          <Form.Control type="number" name="floors" required />
        </Form.Group>

        <Form.Group>
          <Form.Label>عدد المكاتب</Form.Label>
          <Form.Control type="number" name="offices" required />
        </Form.Group>

        <Form.Group>
          <Form.Label>السعة</Form.Label>
          <Form.Control type="number" name="capacity" required />
        </Form.Group>

        <Form.Group>
          <Form.Label>المساحة</Form.Label>
          <Form.Control type="number" step="0.01" name="area" required />
        </Form.Group>

        <Form.Group>
          <Form.Label>تاريخ البناء</Form.Label>
          <Form.Control type="date" name="buildingDate" required />
        </Form.Group>

        <Form.Group>
          <Form.Label>الحالة الإنشائية</Form.Label>
          <Form.Select
            value={structuralCondition}
            onChange={(e) => setStructuralCondition(e.target.value)}
            required
          >
            <option value="">اختر</option>
            <option value="جيد جدا">جيد جدا</option>
            <option value="مرمم حديثا">مرمم حديثا</option>
            <option value="بحاجة ترميم جزئي">بحاجة ترميم جزئي</option>
            <option value="بحاجة ترميم كلي">بحاجة ترميم كلي</option>
          </Form.Select>
        </Form.Group>

        {(structuralCondition === "بحاجة ترميم جزئي" ||
          structuralCondition === "بحاجة ترميم كلي") && (
          <Form.Group>
            <Form.Label>مستوى الخطورة (%)</Form.Label>
            <Form.Control type="number" name="riskLevel" required />
          </Form.Group>
        )}

        {structuralCondition !== "جيد جدا" && (
          <Form.Group>
            <Form.Label>تاريخ الترميم</Form.Label>
            <Form.Control type="date" name="restorationDate" required />
          </Form.Group>
        )}

        {structuralCondition === "مرمم حديثا" && (
          <Form.Group>
            <Form.Label>تفاصيل الترميم</Form.Label>
            <Form.Control name="restorationDetails" required />
          </Form.Group>
        )}

        <Form.Group>
          <Form.Label>نظام إنذار الحريق</Form.Label>
          <Form.Select name="fireAlarmSystem" required>
            <option value="نعم">نعم</option>
            <option value="لا">لا</option>
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label>نظام البصمة</Form.Label>
          <Form.Select name="fingerprintSystem" required>
            <option value="نعم">نعم</option>
            <option value="لا">لا</option>
          </Form.Select>
        </Form.Group>

        {/* 🔥 هنا نستخدم MapPicker الجديد */}
        <Form.Group className="mb-3">
          <Form.Label>اختر الموقع على الخريطة</Form.Label>
          <MapPicker onSelect={setLocation} />
          {location && (
            <div className="mt-2 text-success">
              تم اختيار الموقع: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
            </div>
          )}
        </Form.Group>

        <Button type="submit" className="mt-3 w-100">
          حفظ معلومات البناء
        </Button>
      </Form>
    </div>
  );
}
