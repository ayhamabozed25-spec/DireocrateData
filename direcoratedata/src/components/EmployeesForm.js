import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import Select from "react-select";

export default function EmployeesForm() {
  const [departments, setDepartments] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // جلب الأقسام
  useEffect(() => {
    const fetchDepartments = async () => {
      const snapshot = await getDocs(collection(db, "departments"));
      const data = snapshot.docs.map(doc => ({
        value: doc.data().name,
        label: doc.data().name
      }));
      setDepartments(data);
    };
    fetchDepartments();
  }, []);

  // جلب الشعب
  useEffect(() => {
    const fetchDivisions = async () => {
      const snapshot = await getDocs(collection(db, "divisions"));
      const data = snapshot.docs.map(doc => ({
        value: doc.data().name,
        label: doc.data().name,
        department: doc.data().department // ربط الشعبة بالقسم
      }));
      setDivisions(data);
    };
    fetchDivisions();
  }, []);

  // جلب الموظفين
  useEffect(() => {
    const fetchEmployees = async () => {
      const snapshot = await getDocs(collection(db, "employees"));
      setEmployees(snapshot.docs.map(doc => doc.data()));
    };
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "employees"), {
      name: e.target.name.value,
      gender: e.target.gender.value,
      age: e.target.age.value,
      phone: e.target.phone.value,
      qualification: e.target.qualification.value,
      specialization: e.target.specialization.value,
      startDate: e.target.startDate.value,
      contract: e.target.contract.value,
      jobTitle: e.target.jobTitle.value,
      jobCategory: e.target.jobCategory.value,
      salary: e.target.salary.value,
      task: e.target.task.value,
      status: e.target.status.value,
      endDate: e.target.endDate.value,
      need: e.target.need.value,
      department: e.target.department.value,
      division: e.target.division.value,
    });
    alert("تم حفظ الموظف ✅");
    e.target.reset();
  };

  // فلترة الموظفين حسب البحث
  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // فلترة الشعب حسب القسم المختار
  const filteredDivisions = selectedDepartment
    ? divisions.filter(div => div.department === selectedDepartment.value)
    : [];

  return (
    <div className="p-3">
      <h3>إضافة موظف جديد</h3>

      {/* زر البحث عن الموظفين */}
      <Form.Group className="mb-3">
        <Form.Label>بحث عن موظف</Form.Label>
        <Form.Control
          type="text"
          placeholder="أدخل اسم الموظف"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      {/* عرض نتائج البحث */}
      {searchTerm && (
        <ul>
          {filteredEmployees.map((emp, index) => (
            <li key={index}>
              {emp.name} - القسم: {emp.department || "بدون"} - الشعبة: {emp.division || "بدون"}
            </li>
          ))}
        </ul>
      )}

      {/* نموذج إضافة موظف */}
      <Form onSubmit={handleSubmit}>
        <Form.Group><Form.Label>اسم الموظف</Form.Label><Form.Control name="name" /></Form.Group>
        <Form.Group><Form.Label>الجنس</Form.Label><Form.Control name="gender" /></Form.Group>
        <Form.Group><Form.Label>العمر</Form.Label><Form.Control type="number" name="age" /></Form.Group>
        <Form.Group><Form.Label>الهاتف</Form.Label><Form.Control name="phone" /></Form.Group>
        <Form.Group><Form.Label>المؤهل</Form.Label><Form.Control name="qualification" /></Form.Group>
        <Form.Group><Form.Label>التخصص</Form.Label><Form.Control name="specialization" /></Form.Group>
        <Form.Group><Form.Label>تاريخ المباشرة</Form.Label><Form.Control type="date" name="startDate" /></Form.Group>
        <Form.Group><Form.Label>نوع العقد</Form.Label><Form.Control name="contract" /></Form.Group>
        <Form.Group><Form.Label>المسمى الوظيفي</Form.Label><Form.Control name="jobTitle" /></Form.Group>
        <Form.Group><Form.Label>الفئة</Form.Label><Form.Control name="jobCategory" /></Form.Group>
        <Form.Group><Form.Label>الراتب</Form.Label><Form.Control type="number" name="salary" /></Form.Group>
        <Form.Group><Form.Label>المهام</Form.Label><Form.Control name="task" /></Form.Group>
        <Form.Group><Form.Label>الحالة</Form.Label><Form.Control name="status" /></Form.Group>
        <Form.Group><Form.Label>تاريخ الانتهاء</Form.Label><Form.Control type="date" name="endDate" /></Form.Group>
        <Form.Group><Form.Label>الحاجة</Form.Label><Form.Control name="need" /></Form.Group>

        {/* القسم */}
        <Form.Group>
          <Form.Label>القسم</Form.Label>
          <Select
            options={departments}
            name="department"
            placeholder="اختر القسم"
            isSearchable
            onChange={(val) => setSelectedDepartment(val)}
          />
        </Form.Group>

        {/* الشعبة مرتبطة بالقسم */}
        <Form.Group>
          <Form.Label>الشعبة</Form.Label>
          <Select
            options={filteredDivisions}
            name="division"
            placeholder="اختر الشعبة"
            isSearchable
          />
        </Form.Group>

        <Button type="submit" className="mt-3">حفظ الموظف</Button>
      </Form>
    </div>
  );
}
