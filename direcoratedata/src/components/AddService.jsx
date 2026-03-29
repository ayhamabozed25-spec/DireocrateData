import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button, Row, Col } from "react-bootstrap";
import { syrianDirectorates } from "../data/directorates";

export default function AddService() {
  const [target, setTarget] = useState("");
  const [otherTarget, setOtherTarget] = useState("");

  const [institution, setInstitution] = useState("");
  const [otherInstitution, setOtherInstitution] = useState("");

  const [costType, setCostType] = useState("مجاني بالكامل");
  const [costValue, setCostValue] = useState("");
  const [costCurrency, setCostCurrency] = useState("USD");

  const [timeUnit, setTimeUnit] = useState("يوم");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "services"), {
      name: e.target.name.value,
      details: e.target.details.value,
      target: target === "أخرى" ? otherTarget : target,
      condition: e.target.condition.value,
      otherInstitution:
        institution === "أخرى" ? otherInstitution : institution,
      reason: e.target.reason.value,
      gettingService: e.target.gettingService.value,
      cost:
        costType === "رسوم"
          ? `${costValue} ${costCurrency}`
          : "مجاني بالكامل",
      timeCost: `${e.target.timeCost.value} ${timeUnit}`,
      output: e.target.output.value,
      beneficiaries: e.target.beneficiaries.value,
    });

    alert("تم حفظ الخدمة بنجاح");
    e.target.reset();
  };

  return (
    <div className="p-3">
      <h3>إضافة خدمة جديدة</h3>

      <Form onSubmit={handleSubmit}>

        <Form.Group className="mb-3">
          <Form.Label>اسم الخدمة *</Form.Label>
          <Form.Control name="name" required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>تفاصيل الخدمة *</Form.Label>
          <Form.Control name="details" required />
        </Form.Group>

        {/* المستهدف */}
        <Form.Group className="mb-3">
          <Form.Label>المستهدف *</Form.Label>
          <Form.Select
            required
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          >
            <option value="">اختر المستهدف</option>
            <option value="موظفين">موظفين</option>
            <option value="شركات">شركات</option>
            <option value="مجتمع مدني">مجتمع مدني</option>
            <option value="طلاب">طلاب</option>
            <option value="أخرى">أخرى</option>
          </Form.Select>
        </Form.Group>

        {target === "أخرى" && (
          <Form.Group className="mb-3">
            <Form.Label>حدد المستهدف *</Form.Label>
            <Form.Control
              required
              value={otherTarget}
              onChange={(e) => setOtherTarget(e.target.value)}
            />
          </Form.Group>
        )}

        {/* حالة الخدمة */}
        <Form.Group className="mb-3">
          <Form.Label>حالة الخدمة *</Form.Label>
          <Form.Control as="textarea" rows={3} name="condition" required />
        </Form.Group>

        {/* المؤسسة */}
        <Form.Group className="mb-3">
          <Form.Label>المؤسسة *</Form.Label>
          <Form.Select
            required
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
          >
            <option value="">اختر المؤسسة</option>
            {syrianDirectorates.map((d, i) => (
              <option key={i} value={d}>{d}</option>
            ))}
          </Form.Select>
        </Form.Group>

        {institution === "أخرى" && (
          <Form.Group className="mb-3">
            <Form.Label>حدد المؤسسة *</Form.Label>
            <Form.Control
              required
              value={otherInstitution}
              onChange={(e) => setOtherInstitution(e.target.value)}
            />
          </Form.Group>
        )}

        {/* السبب */}
        <Form.Group className="mb-3">
          <Form.Label>السبب *</Form.Label>
          <Form.Control as="textarea" rows={2} name="reason" required />
        </Form.Group>

        {/* طريقة الحصول */}
        <Form.Group className="mb-3">
          <Form.Label>طريقة الحصول *</Form.Label>
          <Form.Select name="gettingService" required>
            <option value="">اختر الطريقة</option>
            <option value="حضور شخصي">حضور شخصي</option>
            <option value="وكيل">وكيل</option>
            <option value="أونلاين">أونلاين</option>
            <option value="مركز خدمة">مركز خدمة</option>
            <option value="أخرى">أخرى</option>
          </Form.Select>
        </Form.Group>

        {/* الكلفة */}
        <Form.Group className="mb-3">
          <Form.Label>الكلفة *</Form.Label>
          <Form.Select
            required
            value={costType}
            onChange={(e) => setCostType(e.target.value)}
          >
            <option value="مجاني بالكامل">مجاني بالكامل</option>
            <option value="رسوم">رسوم</option>
          </Form.Select>
        </Form.Group>

        {costType === "رسوم" && (
          <Row className="mb-3">
            <Col>
              <Form.Label>قيمة الرسوم *</Form.Label>
              <Form.Control
                type="number"
                required
                value={costValue}
                onChange={(e) => setCostValue(e.target.value)}
              />
            </Col>
            <Col>
              <Form.Label>العملة *</Form.Label>
              <Form.Select
                required
                value={costCurrency}
                onChange={(e) => setCostCurrency(e.target.value)}
              >
                <option value="USD">دولار</option>
                <option value="SYP">ليرة سورية</option>
              </Form.Select>
            </Col>
          </Row>
        )}

        {/* الكلفة الزمنية */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>الكلفة الزمنية *</Form.Label>
            <Form.Control type="number" name="timeCost" required />
          </Col>
          <Col md={6}>
            <Form.Label>الوحدة *</Form.Label>
            <Form.Select
              value={timeUnit}
              onChange={(e) => setTimeUnit(e.target.value)}
            >
              <option value="يوم">يوم</option>
              <option value="ساعة">ساعة</option>
              <option value="شهر">شهر</option>
            </Form.Select>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>المخرجات *</Form.Label>
          <Form.Control name="output" required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>متوسط المستفيدين شهريًا *</Form.Label>
          <Form.Control type="number" name="beneficiaries" required />
        </Form.Group>

        <Button type="submit" className="w-100 mt-3">
          حفظ الخدمة
        </Button>
      </Form>
    </div>
  );
}
