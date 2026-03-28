import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button, Card, InputGroup, ListGroup } from "react-bootstrap";
import { useState, useEffect } from "react";
import Select from "react-select";

export default function CarsForm() {
  const [employees, setEmployees] = useState([]);
  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [need, setNeed] = useState("");
  const [carType, setCarType] = useState("");
  const [carName, setCarName] = useState("");
  const [status, setStatus] = useState("");

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

  useEffect(() => {
    const fetchCars = async () => {
      const snapshot = await getDocs(collection(db, "cars"));
      setCars(snapshot.docs.map(doc => doc.data()));
    };
    fetchCars();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "cars"), {
      need,
      type: carType === "أخرى" ? e.target.otherType.value : carType,
      name: carName === "أخرى" ? e.target.otherName.value : carName,
      employee: need === "مطلوب" ? null : e.target.employee.value,
      status: need === "مطلوب" ? null : status,
      breakdown: status === "معطلة" ? e.target.breakdown.value : null,
      effect: status === "معطلة" ? e.target.effect.value : null,
      priority: status === "معطلة" ? e.target.priority.value : null,
      year: need === "متوفر" ? e.target.year.value : null,
    });

    alert("تم حفظ الآلية ✅");
    e.target.reset();
    setNeed("");
    setCarType("");
    setCarName("");
    setStatus("");
  };

  const filteredCars = cars.filter(car =>
    car.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // أسماء مرتبطة بنوع السيارة
  const carNamesOptions = {
    "سيارة خدمة": ["سبورتاج", "توسان", "كيا ريو", "هيونداي النترا", "أخرى"],
    "مركبة زراعية": ["جرار", "كومباين", "أخرى"],
    "سيارة إسعاف": ["مرسيدس سبرينتر", "فورد ترانزيت", "أخرى"],
    "شاحنة": ["فولفو FH", "مرسيدس أكتروس", "أخرى"],
    "باص": ["هيونداي كاونتي", "مرسيدس ميني باص", "أخرى"],
    "أخرى": ["أخرى"]
  };

  return (
    <div className="p-3">
      <h3>إضافة آلية جديدة</h3>

      {/* بطاقة البحث */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>🔍 البحث عن آلية</Card.Title>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="أدخل اسم الآلية"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="primary">بحث</Button>
          </InputGroup>

          {searchTerm && (
            <ListGroup className="mt-3">
              {filteredCars.map((car, index) => (
                <ListGroup.Item key={index}>
                  {car.name} - الموظف: {car.employee} - الحالة: {car.status}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>

      {/* النموذج */}
      <Form onSubmit={handleSubmit}>
        {/* الحاجة */}
        <Form.Group>
          <Form.Label>الحاجة</Form.Label>
          <Form.Select value={need} onChange={(e) => setNeed(e.target.value)} required>
            <option value="">اختر</option>
            <option value="متوفر">متوفر</option>
            <option value="مطلوب">مطلوب</option>
          </Form.Select>
        </Form.Group>

        {/* نوع الآلية */}
        <Form.Group>
          <Form.Label>نوع الآلية</Form.Label>
          <Form.Select value={carType} onChange={(e) => setCarType(e.target.value)} required>
            <option value="">اختر</option>
            <option value="سيارة خدمة">سيارة خدمة</option>
            <option value="مركبة زراعية">مركبة زراعية</option>
            <option value="سيارة إسعاف">سيارة إسعاف</option>
            <option value="شاحنة">شاحنة</option>
            <option value="باص">باص</option>
            <option value="أخرى">أخرى</option>
          </Form.Select>
        </Form.Group>
        {carType === "أخرى" && (
          <Form.Group><Form.Label>نوع آخر</Form.Label><Form.Control name="otherType" required /></Form.Group>
        )}

        {/* اسم الآلية */}
        {carType && (
          <Form.Group>
            <Form.Label>اسم الآلية</Form.Label>
            <Form.Select value={carName} onChange={(e) => setCarName(e.target.value)} required>
              <option value="">اختر</option>
              {carNamesOptions[carType]?.map((n, i) => (
                <option key={i} value={n}>{n}</option>
              ))}
            </Form.Select>
          </Form.Group>
        )}
        {carName === "أخرى" && (
          <Form.Group><Form.Label>اسم آخر</Form.Label><Form.Control name="otherName" required /></Form.Group>
        )}

        {/* سنة التصنيع */}
        {need === "متوفر" && (
          <Form.Group><Form.Label>سنة التصنيع</Form.Label><Form.Control type="number" name="year" required /></Form.Group>
        )}

        {/* الحقول التي تظهر فقط عند اختيار متوفر */}
        {need === "متوفر" && (
          <>
            <Form.Group>
              <Form.Label>الموظف</Form.Label>
              <Select options={employees} name="employee" placeholder="اختر الموظف" isSearchable />
            </Form.Group>

            <Form.Group>
              <Form.Label>الحالة</Form.Label>
              <Form.Select value={status} onChange={(e) => setStatus(e.target.value)} required>
                <option value="">اختر</option>
                <option value="في الخدمة">في الخدمة</option>
                <option value="معطلة">معطلة</option>
              </Form.Select>
            </Form.Group>

            {status === "معطلة" && (
              <>
                <Form.Group><Form.Label>سبب العطل</Form.Label><Form.Control name="breakdown" required /></Form.Group>
                <Form.Group><Form.Label>التأثير على الخدمة</Form.Label><Form.Control name="effect" required /></Form.Group>
                <Form.Group><Form.Label>أولوية الإصلاح (1-5)</Form.Label><Form.Control type="number" min="1" max="5" name="priority" required /></Form.Group>
              </>
            )}
          </>
        )}

        <Button type="submit" className="mt-3">حفظ الآلية</Button>
      </Form>
    </div>
  );
}
