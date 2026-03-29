import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import Select from "react-select";

export default function AddDevice() {
  const [employees, setEmployees] = useState([]);

  const [need, setNeed] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [brand, setBrand] = useState("");
  const [status, setStatus] = useState("");
  const [processor, setProcessor] = useState("");
  const [costCurrency, setCostCurrency] = useState("USD");

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "devices"), {
      need,
      type: deviceType === "أخرى" ? e.target.otherType?.value : deviceType,
      processor: processor === "أخرى" ? e.target.otherProcessor?.value : processor,
      ram: e.target.ram?.value || null,
      description: e.target.description?.value || null,
      notes: e.target.notes?.value || null,
      cost: `${e.target.cost.value} ${costCurrency}`,
      brand: need === "متوفر" ? brand : null,
      employee: need === "متوفر" ? e.target.employee?.value : null,
      purchaseDate: need === "متوفر" ? e.target.purchaseDate?.value : null,
      status: need === "متوفر" ? status : null,
      breakdown: status === "معطل" ? e.target.breakdown?.value : null,
      effect: (status === "معطل" || status === "يعمل بأداء ضعيف") ? e.target.effect?.value : null,
      priority: status === "معطل" ? e.target.priority?.value : null,
    });

    alert("تم حفظ الجهاز بنجاح");
    e.target.reset();
    setNeed("");
    setDeviceType("");
    setBrand("");
    setStatus("");
    setProcessor("");
  };

  return (
    <div className="p-3">
      <h3>إضافة جهاز جديد</h3>

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
        {(need === "مطلوب" || need === "متوفر") && (
          <>
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
              <Form.Group>
                <Form.Label>نوع آخر</Form.Label>
                <Form.Control name="otherType" required />
              </Form.Group>
            )}
          </>
        )}

        {/* المعالج */}
        {(deviceType === "لاب توب" || deviceType === "سيرفر" || deviceType === "حاسوب مكتبي") && (
          <>
            <Form.Group>
              <Form.Label>المعالج</Form.Label>
              <Form.Select value={processor} onChange={(e) => setProcessor(e.target.value)} required>
                <option value="">اختر</option>
                <option value="Intel i3">Intel i3</option>
                <option value="Intel i5">Intel i5</option>
                <option value="Intel i7">Intel i7</option>
                <option value="Intel i9">Intel i9</option>
                <option value="AMD Ryzen 3">AMD Ryzen 3</option>
                <option value="AMD Ryzen 5">AMD Ryzen 5</option>
                <option value="AMD Ryzen 7">AMD Ryzen 7</option>
                <option value="AMD Ryzen 9">AMD Ryzen 9</option>
                <option value="أخرى">أخرى</option>
              </Form.Select>
            </Form.Group>

            {processor === "أخرى" && (
              <Form.Group>
                <Form.Label>معالج آخر</Form.Label>
                <Form.Control name="otherProcessor" required />
              </Form.Group>
            )}
          </>
        )}

        {/* RAM */}
        {(deviceType === "لاب توب" || deviceType === "سيرفر" || deviceType === "تاب" || deviceType === "حاسوب مكتبي") && (
          <Form.Group>
            <Form.Label>الذاكرة RAM</Form.Label>
            <Form.Select name="ram" required>
              <option value="">اختر</option>
              <option value="2">2 GB</option>
              <option value="4">4 GB</option>
              <option value="8">8 GB</option>
              <option value="16">16 GB</option>
              <option value="32">32 GB</option>
            </Form.Select>
          </Form.Group>
        )}

        {/* الوصف */}
        <Form.Group>
          <Form.Label>الوصف</Form.Label>
          <Form.Control name="description" required />
        </Form.Group>

        {/* ملاحظات */}
        <Form.Group>
          <Form.Label>ملاحظات</Form.Label>
          <Form.Control name="notes" />
        </Form.Group>

        {/* الكلفة */}
        <Row className="mt-3">
          <Col md={8}>
            <Form.Label>الكلفة *</Form.Label>
            <Form.Control type="number" step="0.01" name="cost" required />
          </Col>
          <Col md={4}>
            <Form.Label>العملة</Form.Label>
            <Form.Select value={costCurrency} onChange={(e) => setCostCurrency(e.target.value)}>
              <option value="USD">دولار</option>
              <option value="SYP">ليرة سورية</option>
            </Form.Select>
          </Col>
        </Row>

        <Button type="submit" className="mt-4 w-100">حفظ الجهاز</Button>
      </Form>
    </div>
  );
}
