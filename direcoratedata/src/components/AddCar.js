import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button } from "react-bootstrap";
import Select from "react-select";
import { useAuth } from "../components/AuthContext"; // استدعاء السياق

export default function AddCar() {
  const [employees, setEmployees] = useState([]);
  const [need, setNeed] = useState("");
  const [carType, setCarType] = useState("");
  const [carName, setCarName] = useState("");
  const [status, setStatus] = useState("");

  const { currentUser } = useAuth(); // المستخدم الحالي

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!currentUser) return;

      let q;
      if (currentUser.role === "institutionManager") {
        q = query(collection(db, "employees"), where("institutionName", "==", currentUser.name));
      } else if (currentUser.role === "departementManager") {
        q = query(collection(db, "employees"), where("departmentName", "==", currentUser.departmentName));
      } else if (currentUser.role === "divisionManager") {
        q = query(collection(db, "employees"), where("divisionName", "==", currentUser.divisionName));
      } else {
        q = collection(db, "employees");
      }

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        value: doc.data().name,
        label: doc.data().name
      }));
      setEmployees(data);
    };

    fetchEmployees();
  }, [currentUser]);

  const carNamesOptions = {
    "سيارة خدمة": ["سبورتاج", "توسان", "كيا ريو", "هيونداي النترا", "أخرى"],
    "مركبة زراعية": ["جرار", "كومباين", "أخرى"],
    "سيارة إسعاف": ["مرسيدس سبرينتر", "فورد ترانزيت", "أخرى"],
    "شاحنة": ["فولفو FH", "مرسيدس أكتروس", "أخرى"],
    "باص": ["هيونداي كاونتي", "مرسيدس ميني باص", "أخرى"],
    "أخرى": ["أخرى"]
  };

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

      // 🔑 إضافة البريد الإلكتروني الذي قام بالإدخال
      managerEmail: currentUser?.email || null,
    });

    alert("تم حفظ الآلية بنجاح");
    e.target.reset();
    setNeed("");
    setCarType("");
    setCarName("");
    setStatus("");
  };

  return (
    <div className="p-3">
      <h3>إضافة آلية جديدة</h3>

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

        {/* باقي الحقول كما هي ... */}

        {need === "متوفر" && (
          <Form.Group>
            <Form.Label>الموظف</Form.Label>
            <Select options={employees} name="employee" placeholder="اختر الموظف" isSearchable />
          </Form.Group>
        )}

        <Button type="submit" className="mt-3">حفظ الآلية</Button>
      </Form>
    </div>
  );
}
