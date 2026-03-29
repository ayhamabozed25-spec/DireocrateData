import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  Form,
  Button,
  ListGroup,
  Row,
  Col,
  Table,
  Badge,
} from "react-bootstrap";

export default function ServicesForm() {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // حقول ديناميكية
  const [target, setTarget] = useState("");
  const [otherTarget, setOtherTarget] = useState("");

  const [institution, setInstitution] = useState("");
  const [otherInstitution, setOtherInstitution] = useState("");

  const [costType, setCostType] = useState("مجاني بالكامل");
  const [costValue, setCostValue] = useState("");
  const [costCurrency, setCostCurrency] = useState("USD");

  const [timeUnit, setTimeUnit] = useState("يوم");

  // وضع التعديل
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // فلاتر إضافية
  const [filterTarget, setFilterTarget] = useState("");
  const [filterInstitution, setFilterInstitution] = useState("");

  // قائمة مديريات سوريا
  const syrianDirectorates = [
    "دمشق",
    "ريف دمشق",
    "حلب",
    "حمص",
    "حماة",
    "اللاذقية",
    "طرطوس",
    "درعا",
    "السويداء",
    "القنيطرة",
    "دير الزور",
    "الرقة",
    "الحسكة",
    "إدلب",
    "أخرى",
  ];

  // جلب الخدمات
  const loadServices = async () => {
    const snapshot = await getDocs(collection(db, "services"));
    setServices(snapshot.docs.map((docu) => ({ id: docu.id, ...docu.data() })));
  };

  useEffect(() => {
    loadServices();
  }, []);

  const resetDynamicFields = () => {
    setTarget("");
    setOtherTarget("");
    setInstitution("");
    setOtherInstitution("");
    setCostType("مجاني بالكامل");
    setCostValue("");
    setCostCurrency("USD");
    setTimeUnit("يوم");
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;

    const payload = {
      name: form.name.value,
      details: form.details.value,
      target: target === "أخرى" ? otherTarget : target,
      condition: form.condition.value,
      otherInstitution:
        institution === "أخرى" ? otherInstitution : institution,
      reason: form.reason.value,
      gettingService: form.gettingService.value,
      cost:
        costType === "رسوم"
          ? `${costValue} ${costCurrency}`
          : "مجاني بالكامل",
      timeCost: `${form.timeCost.value} ${timeUnit}`,
      output: form.output.value,
      beneficiaries: form.beneficiaries.value,
    };

    if (isEditing && editingId) {
      await updateDoc(doc(db, "services", editingId), payload);
      alert("تم تعديل الخدمة بنجاح");
    } else {
      await addDoc(collection(db, "services"), payload);
      alert("تم حفظ الخدمة بنجاح");
    }

    form.reset();
    resetDynamicFields();
    loadServices();
  };

  const handleEdit = (service) => {
    setIsEditing(true);
    setEditingId(service.id);

    // تعبئة الحقول
    // نفترض أن cost مخزنة كنص مثل: "10 USD" أو "مجاني بالكامل"
    const [costVal, costCurr] =
      service.cost && service.cost !== "مجاني بالكامل"
        ? service.cost.split(" ")
        : ["", "USD"];

    const [timeVal, timeUnitVal] = service.timeCost
      ? service.timeCost.split(" ")
      : ["", "يوم"];

    // المستهدف
    if (
      ["موظفين", "شركات", "مجتمع مدني", "طلاب"].includes(service.target)
    ) {
      setTarget(service.target);
      setOtherTarget("");
    } else {
      setTarget("أخرى");
      setOtherTarget(service.target || "");
    }

    // المؤسسة
    if (syrianDirectorates.includes(service.otherInstitution)) {
      setInstitution(service.otherInstitution);
      setOtherInstitution("");
    } else {
      setInstitution("أخرى");
      setOtherInstitution(service.otherInstitution || "");
    }

    setCostType(service.cost === "مجاني بالكامل" ? "مجاني بالكامل" : "رسوم");
    setCostValue(costVal !== "مجاني" ? costVal : "");
    setCostCurrency(costCurr || "USD");
    setTimeUnit(timeUnitVal || "يوم");

    // تعبئة الحقول في الفورم عبر DOM (بسيط وسريع)
    setTimeout(() => {
      const form = document.querySelector("#service-form");
      if (!form) return;
      form.name.value = service.name || "";
      form.details.value = service.details || "";
      form.condition.value = service.condition || "";
      form.reason.value = service.reason || "";
      form.gettingService.value = service.gettingService || "";
      form.timeCost.value = timeVal || "";
      form.output.value = service.output || "";
      form.beneficiaries.value = service.beneficiaries || "";
    }, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه الخدمة؟")) return;
    await deleteDoc(doc(db, "services", id));
    loadServices();
  };

  // فلترة البحث + الفلاتر
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.target?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTarget = filterTarget
      ? service.target === filterTarget
      : true;

    const matchesInstitution = filterInstitution
      ? service.otherInstitution === filterInstitution
      : true;

    return matchesSearch && matchesTarget && matchesInstitution;
  });

  // تصدير إلى CSV
  const exportToCSV = () => {
    if (services.length === 0) {
      alert("لا توجد بيانات لتصديرها");
      return;
    }

    const headers = [
      "الاسم",
      "التفاصيل",
      "المستهدف",
      "حالة الخدمة",
      "المؤسسة",
      "السبب",
      "طريقة الحصول",
      "الكلفة",
      "الكلفة الزمنية",
      "المخرجات",
      "المستفيدين شهريًا",
    ];

    const rows = services.map((s) => [
      s.name,
      s.details,
      s.target,
      s.condition,
      s.otherInstitution,
      s.reason,
      s.gettingService,
      s.cost,
      s.timeCost,
      s.output,
      s.beneficiaries,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "services_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-3">

      {/* 🔍 البحث أعلى الصفحة */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-bold">🔍 البحث عن خدمة</Form.Label>
        <Form.Control
          type="text"
          placeholder="ابحث باسم الخدمة أو التفاصيل أو المستهدف..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            borderRadius: "10px",
            padding: "10px",
            border: "2px solid #ddd",
          }}
        />
      </Form.Group>

      {/* فلاتر إضافية */}
      <Row className="mb-4">
        <Col md={6}>
          <Form.Label>فلترة حسب المستهدف</Form.Label>
          <Form.Select
            value={filterTarget}
            onChange={(e) => setFilterTarget(e.target.value)}
          >
            <option value="">الكل</option>
            <option value="موظفين">موظفين</option>
            <option value="شركات">شركات</option>
            <option value="مجتمع مدني">مجتمع مدني</option>
            <option value="طلاب">طلاب</option>
          </Form.Select>
        </Col>
        <Col md={6}>
          <Form.Label>فلترة حسب المؤسسة</Form.Label>
          <Form.Select
            value={filterInstitution}
            onChange={(e) => setFilterInstitution(e.target.value)}
          >
            <option value="">الكل</option>
            {syrianDirectorates.map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* زر التصدير */}
      <div className="mb-4 d-flex justify-content-end">
        <Button variant="success" onClick={exportToCSV}>
          تصدير إلى Excel (CSV)
        </Button>
      </div>

      {/* جدول عرض الخدمات */}
      {filteredServices.length > 0 && (
        <Table striped bordered hover responsive className="mb-5">
          <thead>
            <tr>
              <th>الاسم</th>
              <th>المستهدف</th>
              <th>المؤسسة</th>
              <th>الكلفة</th>
              <th>الزمن</th>
              <th>المستفيدين</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.map((service) => (
              <tr key={service.id}>
                <td>{service.name}</td>
                <td>{service.target}</td>
                <td>{service.otherInstitution}</td>
                <td>
                  {service.cost === "مجاني بالكامل" ? (
                    <Badge bg="success">مجاني</Badge>
                  ) : (
                    service.cost
                  )}
                </td>
                <td>{service.timeCost}</td>
                <td>{service.beneficiaries}</td>
                <td>
                  <Button
                    size="sm"
                    variant="warning"
                    className="me-2"
                    onClick={() => handleEdit(service)}
                  >
                    تعديل
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(service.id)}
                  >
                    حذف
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* نموذج إضافة / تعديل خدمة */}
      <Form id="service-form" onSubmit={handleSubmit}>
        <h5 className="mb-3">
          {isEditing ? "تعديل خدمة" : "إضافة خدمة جديدة"}
        </h5>

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

        {/* مؤسسة أخرى */}
        <Form.Group className="mb-3">
          <Form.Label>مؤسسة أخرى *</Form.Label>
          <Form.Select
            required
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
          >
            <option value="">اختر المؤسسة</option>
            {syrianDirectorates.map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
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
          {isEditing ? "تحديث الخدمة" : "حفظ الخدمة"}
        </Button>
      </Form>
    </div>
  );
}
