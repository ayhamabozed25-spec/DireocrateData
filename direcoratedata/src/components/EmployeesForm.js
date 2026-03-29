import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button, Card, InputGroup, ListGroup } from "react-bootstrap";
import { useState, useEffect } from "react";
import Select from "react-select";
import { jobTitles } from "./jobTitles";

export default function EmployeesForm() {
  const [departments, setDepartments] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [need, setNeed] = useState("");
  const [qualification, setQualification] = useState("");
  const [university, setUniversity] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [jobTitle, setJobTitle] = useState(""); // ✅ جديد

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

  useEffect(() => {
    const fetchDivisions = async () => {
      const snapshot = await getDocs(collection(db, "divisions"));
      const data = snapshot.docs.map(doc => ({
        value: doc.data().name,
        label: doc.data().name,
        department: doc.data().department
      }));
      setDivisions(data);
    };
    fetchDivisions();
  }, []);

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
      phone: need === "شاغر" ? null : e.target.phone.value,
      city: e.target.city.value,
      qualification,
      otherQualification: e.target.otherQualification?.value || null,
      university: university === "أخرى" ? e.target.otherUniversity.value : university,
      specialization: specialization === "أخرى" ? e.target.otherSpecialization.value : specialization,
      certificateSource: e.target.certificateSource.value,
      certificateDate: e.target.certificateDate.value,
      contract: e.target.contract.value,
      jobTitle,
      otherJobTitle: jobTitle === "أخرى" ? (e.target.otherJobTitle?.value || null) : null,
      matchCertificate: e.target.matchCertificate.value,
      jobCategory: e.target.jobCategory.value,
      salary: e.target.salary.value,
      task: e.target.task.value,
      need,
      department: need === "شاغر" ? null : e.target.department?.value || null,
      division: need === "شاغر" ? null : e.target.division?.value || null,
    });
    alert("تم حفظ الموظف ✅");
    e.target.reset();
    setNeed("");
    setQualification("");
    setUniversity("");
    setSpecialization("");
    setJobTitle(""); // ✅ إعادة التهيئة
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDivisions = selectedDepartment
    ? divisions.filter(div => div.department === selectedDepartment.value)
    : [];

  const universitiesOptions = {
    "جامعة 5 سنوات": ["كلية الطب", "كلية الهندسة المدنية", "كلية الهندسة المعمارية", "كلية طب الأسنان", "أخرى"],
    "جامعة 4 سنوات": ["كلية الاقتصاد", "كلية الحقوق", "كلية التربية", "كلية الآداب", "أخرى"],
    "معهد": ["معهد الحاسوب", "معهد الكهرباء", "معهد الميكانيك", "أخرى"],
    "ثانوي": ["علمي", "شرعي", "صناعة", "أخرى"]
  };

  const specializationsOptions = {
    "كلية الطب": ["طب بشري", "جراحة عامة", "أخرى"],
    "كلية الهندسة المدنية": ["إنشاءات", "مياه", "طرق", "أخرى"],
    "كلية الاقتصاد": ["إدارة أعمال", "محاسبة", "اقتصاد", "أخرى"],
    "كلية الحقوق": ["قانون عام", "قانون خاص", "أخرى"],
    "معهد الحاسوب": ["برمجة", "شبكات", "أخرى"],
    "معهد الكهرباء": ["تحكم آلي", "قوى كهربائية", "أخرى"],
    "ثانوي": ["علمي", "شرعي", "صناعة", "أخرى"]
  };

  return (
    <div className="p-3">
      <h3>إضافة موظف جديد</h3>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>🔍 البحث عن موظف</Card.Title>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="أدخل اسم الموظف"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="primary">بحث</Button>
          </InputGroup>

          {searchTerm && (
            <ListGroup className="mt-3">
              {filteredEmployees.map((emp, index) => (
                <ListGroup.Item key={index}>
                  {emp.name} - القسم: {emp.department || "بدون"} - الشعبة: {emp.division || "بدون"}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>

      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>الحاجة</Form.Label>
          <Form.Select value={need} onChange={(e) => setNeed(e.target.value)} required>
            <option value="">اختر</option>
            <option value="شاغر">شاغر</option>
            <option value="متوفر">متوفر</option>
          </Form.Select>
        </Form.Group>

        <Form.Group><Form.Label>اسم الموظف</Form.Label><Form.Control name="name" required /></Form.Group>

        <Form.Group>
          <Form.Label>الجنس</Form.Label>
          <Form.Select name="gender" required>
            <option value="">اختر</option>
            <option value="ذكر">ذكر</option>
            <option value="أنثى">أنثى</option>
          </Form.Select>
        </Form.Group>

        <Form.Group><Form.Label>العمر</Form.Label><Form.Control type="number" name="age" min="15" max="80" required /></Form.Group>

        {need === "متوفر" && (
          <Form.Group><Form.Label>الهاتف</Form.Label><Form.Control name="phone" required /></Form.Group>
        )}

        <Form.Group>
          <Form.Label>السكن الحالي</Form.Label>
          <Form.Select name="city" required>
            <option value="">اختر</option>
            <option value="دمشق">دمشق</option>
            <option value="حلب">حلب</option>
            <option value="اللاذقية">اللاذقية</option>
            <option value="حمص">حمص</option>
            <option value="حماة">حماة</option>
            <option value="طرطوس">طرطوس</option>
            <option value="درعا">درعا</option>
            <option value="الرقة">الرقة</option>
            <option value="دير الزور">دير الزور</option>
            <option value="الحسكة">الحسكة</option>
            <option value="إدلب">إدلب</option>
            <option value="السويداء">السويداء</option>
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label>المؤهل</Form.Label>
          <Form.Select value={qualification} onChange={(e) => setQualification(e.target.value)} name="qualification" required>
            <option value="">اختر</option>
            <option value="دراسات عليا">دراسات عليا</option>
            <option value="جامعة 5 سنوات">جامعة 5 سنوات</option>
            <option value="جامعة 4 سنوات">جامعة 4 سنوات</option>
            <option value="معهد">معهد</option>
            <option value="ثانوي">ثانوي</option>
            <option value="أساسي">أساسي</option>
            <option value="إعدادي">إعدادي</option>
            <option value="أخرى">أخرى</option>
          </Form.Select>
        </Form.Group>
        {qualification === "أخرى" && (
          <Form.Group><Form.Label>مؤهل آخر</Form.Label><Form.Control name="otherQualification" required /></Form.Group>
        )}

    {(qualification === "جامعة 5 سنوات" || qualification === "جامعة 4 سنوات" || qualification === "معهد" || qualification === "ثانوي") && (
  <Form.Group>
    <Form.Label>اسم الجامعة / المعهد</Form.Label>
    <Form.Select
      value={university}
      onChange={(e) => setUniversity(e.target.value)}
      name="university"
      required
    >
      <option value="">اختر</option>
      {universitiesOptions[qualification]?.map((u, i) => (
        <option key={i} value={u}>{u}</option>
      ))}
    </Form.Select>
  </Form.Group>
)}

        {university === "أخرى" && (
          <Form.Group><Form.Label>جامعة / معهد آخر</Form.Label><Form.Control name="otherUniversity" required /></Form.Group>
        )}

        {/* التخصص */}
        {specializationsOptions[university] && (
          <Form.Group>
            <Form.Label>التخصص</Form.Label>
            <Form.Select value={specialization} onChange={(e) => setSpecialization(e.target.value)} name="specialization" required>
              <option value="">اختر</option>
              {specializationsOptions[university]?.map((s, i) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </Form.Select>
          </Form.Group>
        )}
        {specialization === "أخرى" && (
          <Form.Group><Form.Label>تخصص آخر</Form.Label><Form.Control name="otherSpecialization" required /></Form.Group>
        )}

        {/* مصدر الشهادة */}
        <Form.Group>
          <Form.Label>مصدر الشهادة</Form.Label>
          <Form.Select name="certificateSource" required>
            <option value="">اختر</option>
            <option value="دمشق">دمشق</option>
            <option value="حلب">حلب</option>
            <option value="اللاذقية">اللاذقية</option>
            <option value="حمص">حمص</option>
            <option value="حماة">حماة</option>
            <option value="طرطوس">طرطوس</option>
            <option value="درعا">درعا</option>
            <option value="الرقة">الرقة</option>
            <option value="دير الزور">دير الزور</option>
            <option value="الحسكة">الحسكة</option>
            <option value="إدلب">إدلب</option>
            <option value="السويداء">السويداء</option>
          </Form.Select>
        </Form.Group>

        <Form.Group><Form.Label>تاريخ الحصول على الشهادة</Form.Label><Form.Control type="date" name="certificateDate" required /></Form.Group>

        {/* نوع العقد */}
        <Form.Group>
          <Form.Label>نوع العقد</Form.Label>
          <Form.Select name="contract" required>
            <option value="">اختر</option>
            <option value="مثبت">مثبت</option>
            <option value="عقد دائم">عقد دائم</option>
            <option value="عقد موسمي">عقد موسمي</option>
            <option value="عقد سنوي">عقد سنوي</option>
          </Form.Select>
        </Form.Group>

        {/* المسمى الوظيفي */}
    
<Form.Group>
  <Form.Label>المسمى الوظيفي</Form.Label>
  <Form.Control
    list="jobTitlesList"
    value={jobTitle}
    onChange={(e) => setJobTitle(e.target.value)}
    placeholder="ابحث عن المسمى الوظيفي..."
    required
  />
  <datalist id="jobTitlesList">
    {jobTitles.map((title, idx) => (
      <option key={idx} value={title} />
    ))}
    <option value="أخرى" />
  </datalist>
</Form.Group>

{jobTitle === "أخرى" && (
  <Form.Group>
    <Form.Label>مسمى وظيفي آخر</Form.Label>
    <Form.Control name="otherJobTitle" required />
  </Form.Group>
)}


        {/* مطابقة الشهادة للمسمى الوظيفي */}
        <Form.Group>
          <Form.Label>هل الشهادة مطابقة لاحتياج المسمى الوظيفي؟</Form.Label>
          <Form.Select name="matchCertificate" required>
            <option value="">اختر</option>
            <option value="نعم">نعم</option>
            <option value="لا">لا</option>
          </Form.Select>
        </Form.Group>

        {/* الفئة */}
        <Form.Group><Form.Label>الفئة (1-5)</Form.Label><Form.Control type="number" min="1" max="5" name="jobCategory" required /></Form.Group>

        {/* الراتب */}
        <Form.Group><Form.Label>الراتب (بالدولار)</Form.Label><Form.Control type="number" step="0.01" name="salary" required /></Form.Group>

        {/* المهام */}
        <Form.Group><Form.Label>المهام</Form.Label><Form.Control as="textarea" rows={3} name="task" required /></Form.Group>

        {/* القسم والشعبة تظهر فقط عند اختيار متوفر */}
        {need === "متوفر" && (
          <>
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

            <Form.Group>
              <Form.Label>الشعبة</Form.Label>
              <Select
                options={filteredDivisions}
                name="division"
                placeholder="اختر الشعبة"
                isSearchable
              />
            </Form.Group>
          </>
        )}

        <Button type="submit" className="mt-3">حفظ الموظف</Button>
      </Form>
    </div>
  );
}
