import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import Select from "react-select";

export default function DevicesForm() {
  const [employees, setEmployees] = useState([]);
  const [devices, setDevices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [need, setNeed] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [brand, setBrand] = useState("");
  const [status, setStatus] = useState("");

  // جلب الموظفين
  useEffect(() => {
    const fetchEmployees = async () => {
      const snapshot = await getDocs(collection(db, "employees"));
      const data = snapshot.docs.map(doc => ({
        value: doc.data().name,
        label: doc.data().name
      }));
      setEmployees(data);
    };
    fetchEmployees();
  }, []);

  // جلب الأجهزة
  useEffect(() => {
    const fetchDevices = async () => {
      const snapshot = await getDocs(collection(db, "devices"));
      setDevices(snapshot.docs.map(doc => doc.data()));
    };
    fetchDevices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "devices"), {
      need,
      type: deviceType === "أخرى" ? e.target.otherType.value : deviceType,
      brand: brand === "أخرى" ? e.target.otherBrand.value : brand,
      model: e.target.model.value === "أخرى" ? e.target.otherModel.value : e.target.model.value,
      employee: need === "مطلوب" ? null : e.target.employee.value,
      purchaseDate: need === "مطلوب" ? null : e.target.purchaseDate.value,
      cost: parseFloat(e.target.cost.value),
      status: need === "مطلوب" ? null : status,
      breakdown: status === "معطل" ? e.target.breakdown.value : null,
      effect: (status === "معطل" || status === "يعمل بأداء ضعيف") ? e.target.effect.value : null,
      priority: status === "معطل" ? e.target.priority.value : null,
      description: e.target.description.value,
      notes: e.target.notes.value,
    });

    alert("تم حفظ الجهاز ✅");
    e.target.reset();
    setNeed("");
    setDeviceType("");
    setBrand("");
    setStatus("");
  };

  // فلترة الأجهزة
  const filteredDevices = devices.filter(dev =>
    dev.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dev.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dev.model?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-3">
      <h3>إضافة جهاز جديد</h3>

      {/* البحث */}
      <Form.Group className="mb-3">
        <Form.Label>بحث عن جهاز</Form.Label>
        <Form.Control
          type="text"
          placeholder="أدخل نوع الجهاز أو الشركة أو الموديل"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      {searchTerm && (
        <ul>
          {filteredDevices.map((dev, index) => (
            <li key={index}>
              {dev.type} - {dev.brand} - {dev.model} - الموظف: {dev.employee}
            </li>
          ))}
        </ul>
      )}

      {/* النموذج */}
      <Form onSubmit={handleSubmit}>
        {/* الحاجة */}
        <Form.Group>
          <Form.Label>الحاجة</Form.Label>
          <Form.Select value={need} onChange={(e) => setNeed(e.target.value)} required>
            <option value="">اختر</option>
            <option value="مطلوب">مطلوب</option>
            <option value="متوفر">متوفر</option>
          </Form.Select>
        </Form.Group>

        {/* نوع الجهاز */}
        <Form.Group>
          <Form.Label>نوع الجهاز</Form.Label>
          <Form.Select value={deviceType} onChange={(e) => setDeviceType(e.target.value)} required>
            <option value="">اختر</option>
            <option value="لاب توب">لاب توب</option>
            <option value="سيرفر">سيرفر</option>
            <option value="حاسوب مكتبي">حاسوب مكتبي</option>
            <option value="تاب">تاب</option>
            <option value="طابعة">طابعة</option>
            <option value="راوتر">راوتر</option>
            <option value="أخرى">أخرى</option>
          </Form.Select>
        </Form.Group>
        {deviceType === "أخرى" && (
          <Form.Group><Form.Label>نوع آخر</Form.Label><Form.Control name="otherType" required /></Form.Group>
        )}

        {/* البراند */}
        {need === "متوفر" && (
          <>
            <Form.Group>
              <Form.Label>البراند</Form.Label>
              <Form.Select value={brand} onChange={(e) => setBrand(e.target.value)} required>
                <option value="">اختر</option>
                <option value="Dell">Dell</option>
                <option value="HP">HP</option>
                <option value="Lenovo">Lenovo</option>
                <option value="Asus">Asus</option>
                <option value="Canon">Canon</option>
                <option value="Cisco">Cisco</option>
                <option value="أخرى">أخرى</option>
              </Form.Select>
            </Form.Group>
            {brand === "أخرى" && (
              <Form.Group><Form.Label>براند آخر</Form.Label><Form.Control name="otherBrand" required /></Form.Group>
            )}

            {/* الموديل */}
            <Form.Group>
              <Form.Label>الموديل</Form.Label>
              <Form.Select name="model" required>
                <option value="">اختر</option>
                <option value="Model1">Model1</option>
                <option value="Model2">Model2</option>
                <option value="أخرى">أخرى</option>
              </Form.Select>
            </Form.Group>
            <Form.Group><Form.Label>موديل آخر</Form.Label><Form.Control name="otherModel" /></Form.Group>

            {/* باقي الحقول */}
            <Form.Group><Form.Label>تاريخ الشراء</Form.Label><Form.Control type="date" name="purchaseDate" required /></Form.Group>
            <Form.Group><Form.Label>الموظف</Form.Label><Select options={employees} name="employee" placeholder="اختر الموظف" isSearchable /></Form.Group>
            <Form.Group><Form.Label>الكلفة (بالدولار)</Form.Label><Form.Control type="number" step="0.01" name="cost" required /></Form.Group>

            <Form.Group>
              <Form.Label>الحالة</Form.Label>
              <Form.Select value={status} onChange={(e) => setStatus(e.target.value)} required>
                <option value="">اختر</option>
                <option value="يعمل بشكل جيد">يعمل بشكل جيد</option>
                <option value="يعمل بأداء ضعيف">يعمل بأداء ضعيف</option>
                <option value="معطل">معطل</option>
              </Form.Select>
            </Form.Group>

            {status === "معطل" && (
              <>
                <Form.Group><Form.Label>وصف العطل</Form.Label><Form.Control name="breakdown" required /></Form.Group>
                <Form.Group><Form.Label>أولوية الإصلاح (1-5)</Form.Label><Form.Control type="number" min="1" max="5" name="priority" required /></Form.Group>
              </>
            )}

            {(status === "معطل" || status === "يعمل بأداء ضعيف") && (
              <Form.Group><Form.Label>التأثير على الخدمة (%)</Form.Label><Form.Control type="number" name="effect" required /></Form.Group>
            )}
          </>
        )}

        <Form.Group><Form.Label>الوصف</Form.Label><Form.Control name="description" required /></Form.Group>
        <Form.Group><Form.Label>ملاحظات</Form.Label><Form.Control name="notes" required /></Form.Group>

        <Button type="submit" className="mt-3">حفظ الجهاز</Button>
      </Form>
    </div>
  );
}
