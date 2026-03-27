import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";

export default function BuildingForm() {
  const [buildings, setBuildings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // جلب الأبنية من قاعدة البيانات
  useEffect(() => {
    const fetchBuildings = async () => {
      const snapshot = await getDocs(collection(db, "buildings"));
      setBuildings(snapshot.docs.map(doc => doc.data()));
    };
    fetchBuildings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "buildings"), {
      name: e.target.name.value,
      cost: e.target.cost.value,
      ownership: e.target.ownership.value,
      floors: e.target.floors.value,
      offices: e.target.offices.value,
      capacity: e.target.capacity.value,
      area: e.target.area.value,
      buildingDate: e.target.buildingDate.value,
      structuralCondition: e.target.structuralCondition.value,
      riskLevel: e.target.riskLevel.value,
      restorationDate: e.target.restorationDate.value,
      restorationDetails: e.target.restorationDetails.value,
      fireAlarmSystem: e.target.fireAlarmSystem.value,
      fingerprintSystem: e.target.fingerprintSystem.value,
    });
    alert("تم حفظ معلومات البناء ✅");
    e.target.reset();
  };

  // فلترة الأبنية حسب البحث
  const filteredBuildings = buildings.filter(b =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-3">
      <h3>إضافة معلومات بناء جديد</h3>

      {/* زر البحث عن الأبنية */}
      <Form.Group className="mb-3">
        <Form.Label>بحث عن بناء</Form.Label>
        <Form.Control
          type="text"
          placeholder="أدخل اسم البناء"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      {/* عرض نتائج البحث */}
      {searchTerm && (
        <ul>
          {filteredBuildings.map((b, index) => (
            <li key={index}>
              {b.name} - الطوابق: {b.floors} - المكاتب: {b.offices} - الحالة الإنشائية: {b.structuralCondition}
            </li>
          ))}
        </ul>
      )}

      {/* نموذج إضافة بناء */}
      <Form onSubmit={handleSubmit}>
        <Form.Group><Form.Label>اسم البناء</Form.Label><Form.Control name="name" /></Form.Group>
        <Form.Group><Form.Label>الكلفة</Form.Label><Form.Control type="number" name="cost" /></Form.Group>
        <Form.Group><Form.Label>الملكية</Form.Label><Form.Control name="ownership" /></Form.Group>
        <Form.Group><Form.Label>عدد الطوابق</Form.Label><Form.Control type="number" name="floors" /></Form.Group>
        <Form.Group><Form.Label>عدد المكاتب</Form.Label><Form.Control type="number" name="offices" /></Form.Group>
        <Form.Group><Form.Label>السعة</Form.Label><Form.Control type="number" name="capacity" /></Form.Group>
        <Form.Group><Form.Label>المساحة</Form.Label><Form.Control type="number" name="area" /></Form.Group>
        <Form.Group><Form.Label>تاريخ البناء</Form.Label><Form.Control type="date" name="buildingDate" /></Form.Group>
        <Form.Group><Form.Label>الحالة الإنشائية</Form.Label><Form.Control name="structuralCondition" /></Form.Group>
        <Form.Group><Form.Label>مستوى الخطورة</Form.Label><Form.Control name="riskLevel" /></Form.Group>
        <Form.Group><Form.Label>تاريخ الترميم</Form.Label><Form.Control type="date" name="restorationDate" /></Form.Group>
        <Form.Group><Form.Label>تفاصيل الترميم</Form.Label><Form.Control name="restorationDetails" /></Form.Group>
        <Form.Group><Form.Label>نظام إنذار الحريق</Form.Label><Form.Control name="fireAlarmSystem" /></Form.Group>
        <Form.Group><Form.Label>نظام البصمة</Form.Label><Form.Control name="fingerprintSystem" /></Form.Group>

        <Button type="submit" className="mt-3">حفظ معلومات البناء</Button>
      </Form>
    </div>
  );
}
