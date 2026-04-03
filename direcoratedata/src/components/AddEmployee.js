import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button } from "react-bootstrap";
import Select from "react-select";
import { jobTitles } from "./jobTitles";
import { useAuth } from "../components/AuthContext"; // استدعاء السياق

export default function AddEmployee() {
  const [departments, setDepartments] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const [need, setNeed] = useState("");
  const [qualification, setQualification] = useState("");
  const [university, setUniversity] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  const { currentUser } = useAuth(); // المستخدم الحالي

  // تحميل الأقسام حسب الدور
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!currentUser) return;

      let q;
      if (currentUser.role === "institutionManager") {
        q = query(collection(db, "departments"), where("institutionName", "==", currentUser.name));
      } else if (currentUser.role === "departementManager") {
        // القسم الخاص بالمستخدم فقط
        setDepartments([{ value: currentUser.departmentName, label: currentUser.departmentName }]);
        setSelectedDepartment({ value: currentUser.departmentName, label: currentUser.departmentName });
        return;
      } else if (currentUser.role === "divisionManager") {
        // القسم الخاص بالمستخدم فقط
        setDepartments([{ value: currentUser.departmentName, label: currentUser.departmentName }]);
        setSelectedDepartment({ value: currentUser.departmentName, label: currentUser.departmentName });
        return;
      } else {
        q = collection(db, "departments"); // مدير النظام يرى الجميع
      }

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        value: doc.data().name,
        label: doc.data().name
      }));
      setDepartments(data);
    };
    fetchDepartments();
  }, [currentUser]);

  // تحميل الشعب
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

  // فلترة الشعب حسب القسم
  const filteredDivisions = selectedDepartment
    ? divisions.filter(div => div.department === selectedDepartment.value)
    : [];

  // ============================
  // الجامعات حسب المؤهل
  // ============================
  const universitiesOptions = {
    "دراسات عليا": [
      "كلية الطب البشري",
      "كلية طب الأسنان",
      "كلية الصيدلة",
      "كلية الهندسة المدنية",
      "كلية الهندسة المعمارية",
      "كلية الهندسة المعلوماتية",
      "كلية الهندسة الكهربائية",
      "كلية الهندسة الميكانيكية",
      "كلية الهندسة الزراعية",
      "كلية الهندسة البيئية",
      "كلية الفنون الجميلة",
      "كلية الاقتصاد",
      "كلية الحقوق",
      "كلية التربية",
      "كلية الآداب",
      "كلية العلوم",
      "كلية الإعلام",
      "كلية السياحة",
      "كلية الطب البيطري",
      "أخرى"
    ],

    "جامعة 5 سنوات": [
      "كلية الطب البشري",
      "كلية طب الأسنان",
      "كلية الصيدلة",
      "كلية الهندسة المدنية",
      "كلية الهندسة المعمارية",
      "كلية الهندسة المعلوماتية",
      "كلية الهندسة الكهربائية",
      "كلية الهندسة الميكانيكية",
      "كلية الهندسة الزراعية",
      "كلية الهندسة البيئية",
      "كلية الفنون الجميلة",
      "أخرى"
    ],

    "جامعة 4 سنوات": [
      "كلية الاقتصاد",
      "كلية الحقوق",
      "كلية التربية",
      "كلية الآداب",
      "كلية العلوم",
      "كلية الإعلام",
      "كلية السياحة",
      "كلية الطب البيطري",
      "أخرى"
    ],

    "معهد": [
      "معهد الحاسوب",
      "معهد الكهرباء",
      "معهد الميكانيك",
      "معهد صحي",
      "معهد تمريض",
      "معهد تقاني زراعي",
      "معهد تقاني هندسي",
      "أخرى"
    ],

    "ثانوي": [
      "علمي",
      "أدبي",
      "شرعي",
      "صناعة",
      "تجارة",
      "معلوماتية",
      "أخرى"
    ]
  };

  // ============================
  // التخصصات حسب الجامعة
  // ============================
  const specializationsOptions = {
    "كلية الطب البشري": [
      "طب بشري",
      "جراحة عامة",
      "جراحة عظمية",
      "جراحة عصبية",
      "جراحة قلبية",
      "أمراض داخلية",
      "أطفال",
      "نسائية وتوليد",
      "جلدية",
      "أنف أذن حنجرة",
      "عيون",
      "تخدير",
      "أشعة",
      "أخرى"
    ],

    "كلية طب الأسنان": [
      "تقويم",
      "تعويضات سنية",
      "جراحة فم وفكين",
      "لب وجذور",
      "أخرى"
    ],

    "كلية الصيدلة": [
      "صيدلة عامة",
      "صيدلة صناعية",
      "مراقبة دوائية",
      "أخرى"
    ],

    "كلية الهندسة المدنية": [
      "إنشاءات",
      "مياه",
      "طرق وجسور",
      "هندسة زلازل",
      "إدارة مشاريع",
      "أخرى"
    ],

    "كلية الهندسة المعلوماتية": [
      "برمجيات",
      "ذكاء اصطناعي",
      "شبكات",
      "نظم معلومات",
      "أمن معلومات",
      "أخرى"
    ],

    "كلية الهندسة الميكانيكية": [
      "قوى ميكانيكية",
      "ميكاترونيكس",
      "تبريد وتكييف",
      "تصميم وتصنيع",
      "أخرى"
    ],

    "كلية الهندسة الكهربائية": [
      "قوى كهربائية",
      "اتصالات",
      "تحكم آلي",
      "الكترونيات",
      "أخرى"
    ],

    "كلية الهندسة المعمارية": [
      "تصميم معماري",
      "تخطيط عمراني",
      "ترميم",
      "أخرى"
    ],

    "كلية الاقتصاد": [
      "إدارة أعمال",
      "محاسبة",
      "اقتصاد",
      "تمويل ومصارف",
      "تسويق",
      "إحصاء",
      "أخرى"
    ],

    "كلية الحقوق": [
      "قانون عام",
      "قانون خاص",
      "قانون دولي",
      "قانون جنائي",
      "أخرى"
    ],

    "كلية العلوم": [
      "رياضيات",
      "فيزياء",
      "كيمياء",
      "علوم حياة",
      "إحصاء",
      "جيولوجيا",
      "أخرى"
    ],

    "كلية الآداب": [
      "اللغة العربية",
      "اللغة الإنجليزية",
      "اللغة الفرنسية",
      "الجغرافيا",
      "التاريخ",
      "علم الاجتماع",
      "الفلسفة",
      "علم النفس",
      "أخرى"
    ],

    "كلية التربية": [
      "معلم صف",
      "إرشاد نفسي",
      "تعليم أساسي",
      "تعليم خاص",
      "أخرى"
    ],

    "كلية الإعلام": [
      "صحافة",
      "علاقات عامة",
      "إذاعة وتلفزيون",
      "إعلام رقمي",
      "أخرى"
    ],

    "كلية الزراعة": [
      "محاصيل",
      "وقاية نبات",
      "تربة وري",
      "اقتصاد زراعي",
      "أخرى"
    ],

    "كلية الطب البيطري": [
      "طب بيطري عام",
      "أمراض حيوانية",
      "تغذية حيوانية",
      "أخرى"
    ],

    "كلية السياحة": [
      "إدارة فنادق",
      "إدارة سياحية",
      "إرشاد سياحي",
      "أخرى"
    ],

    "كلية الفنون الجميلة": [
      "تصميم غرافيك",
      "نحت",
      "تصوير",
      "ديكور",
      "أخرى"
    ],

    "المعاهد المتوسطة": [
      "معهد الحاسوب – برمجة",
      "معهد الحاسوب – شبكات",
      "معهد الكهرباء – قوى",
      "معهد الكهرباء – تحكم",
      "معهد الميكانيك – إنتاج",
      "معهد الميكانيك – تبريد وتكييف",
      "معهد صحي – مخابر",
      "معهد صحي – تمريض",
      "أخرى"
    ],

    "الثانوية": [
      "علمي",
      "أدبي",
      "شرعي",
      "صناعة",
      "تجارة",
      "معلوماتية",
      "أخرى"
    ]
  };

  // ============================
  // حفظ الموظف
  // ============================
const handleSubmit = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "employees"), {
      name: e.target.name?.value || null,
      gender: e.target.gender.value,
      age: e.target.age.value,
      phone: need === "شاغر" ? null : e.target.phone?.value || null,
      city: e.target.city.value,
      qualification,
      university,
      specialization,
      jobTitle,
      need,
      department: selectedDepartment?.value || currentUser?.departmentName || null,
      division:
        currentUser.role === "divisionManager"
          ? currentUser.divisionName
          : e.target.division?.value || null,
      managerEmail: currentUser?.email || null, // حفظ البريد الحالي
    });

    alert("تم حفظ الموظف بنجاح");
    e.target.reset();
    setNeed("");
    setQualification("");
    setUniversity("");
    setSpecialization("");
    setJobTitle("");
    setSelectedDepartment(null);
  };

  // ============================
  // واجهة الإدخال
  // ============================
  return (
    <div className="p-3">
      <h3>إضافة موظف جديد</h3>

      <Form onSubmit={handleSubmit}>

        {/* الحاجة */}
        <Form.Group>
          <Form.Label>الحاجة</Form.Label>
          <Form.Select value={need} onChange={(e) => setNeed(e.target.value)} required>
            <option value="">اختر</option>
            <option value="شاغر">شاغر</option>
            <option value="متوفر">متوفر</option>
          </Form.Select>
        </Form.Group>

        {/* اسم الموظف */}
        {need === "متوفر" && (
          <Form.Group>
            <Form.Label>اسم الموظف</Form.Label>
            <Form.Control name="name" required />
          </Form.Group>
        )}

        {/* الجنس */}
        <Form.Group>
          <Form.Label>الجنس</Form.Label>
          <Form.Select name="gender" required>
            <option value="">اختر</option>
            <option value="ذكر">ذكر</option>
            <option value="أنثى">أنثى</option>
          </Form.Select>
        </Form.Group>

        {/* العمر */}
        <Form.Group>
          <Form.Label>العمر</Form.Label>
          <Form.Control type="number" name="age" min="15" max="80" required />
        </Form.Group>

        {/* الهاتف */}
        {need === "متوفر" && (
          <Form.Group>
            <Form.Label>الهاتف</Form.Label>
            <Form.Control
              name="phone"
              required
              inputMode="numeric"
              pattern="[0-9]{9,}"
              placeholder="أدخل رقم الهاتف (9 أرقام على الأقل)"
            />
          </Form.Group>
        )}

        {/* السكن */}
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

        {/* المؤهل */}
        <Form.Group>
          <Form.Label>المؤهل</Form.Label>
          <Form.Select
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
            name="qualification"
            required
          >
            <option value="">اختر</option>
            <option value="دراسات عليا">دراسات عليا</option>
            <option value="جامعة 5 سنوات">جامعة 5 سنوات</option>
            <option value="جامعة 4 سنوات">جامعة 4 سنوات</option>
            <option value="معهد">معهد</option>
            <option value="ثانوي">ثانوي</option>
            <option value="أساسي">أساسي</option>
            <option value="إعدادي">إعدادي</option>
            <option value="غير متعلم">غير متعلم</option>
          </Form.Select>
        </Form.Group>

        {/* الجامعة */}
        {(qualification === "دراسات عليا" ||
          qualification === "جامعة 5 سنوات" ||
          qualification === "جامعة 4 سنوات" ||
          qualification === "معهد" ||
          qualification === "ثانوي") && (
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

        {/* جامعة أخرى */}
        {university === "أخرى" && (
          <Form.Group>
            <Form.Label>جامعة / معهد آخر</Form.Label>
            <Form.Control name="otherUniversity" required />
          </Form.Group>
        )}

        {/* التخصص */}
        {specializationsOptions[university] && (
          <Form.Group>
            <Form.Label>التخصص</Form.Label>
            <Form.Select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              name="specialization"
              required
            >
              <option value="">اختر</option>
              {specializationsOptions[university]?.map((s, i) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </Form.Select>
          </Form.Group>
        )}

        {/* تخصص آخر */}
        {(specialization === "أخرى" || university === "أخرى") && (
          <Form.Group>
            <Form.Label>تخصص آخر</Form.Label>
            <Form.Control name="otherSpecialization" required />
          </Form.Group>
        )}

        {/* طالب / متخرج */}
        {(qualification === "دراسات عليا" ||
          qualification === "جامعة 5 سنوات" ||
          qualification === "جامعة 4 سنوات" ||
          qualification === "معهد" ||
          qualification === "ثانوي") && (
          <Form.Group>
            <Form.Label>طالب / متخرج</Form.Label>
            <Form.Select
              name="IsStudent"
              required
              onChange={(e) => setIsStudent(e.target.value)}
            >
              <option value="">اختر</option>
              <option value="طالب">طالب</option>
              <option value="حاصل على الشهادة">حاصل على الشهادة</option>
            </Form.Select>
          </Form.Group>
        )}

        {/* تاريخ الحصول على الشهادة */}
        {need === "متوفر" && IsStudent === "حاصل على الشهادة" && (
          <Form.Group>
            <Form.Label>تاريخ الحصول على الشهادة</Form.Label>
            <Form.Control type="date" name="certificateDate" required />
          </Form.Group>
        )}

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
        {need === "متوفر" && (
          <Form.Group>
            <Form.Label>هل الشهادة مطابقة لاحتياج المسمى الوظيفي؟</Form.Label>
            <Form.Select name="matchCertificate" required>
              <option value="">اختر</option>
              <option value="نعم">نعم</option>
              <option value="لا">لا</option>
            </Form.Select>
          </Form.Group>
        )}

        {/* الفئة */}
        <Form.Group>
          <Form.Label>الفئة (1-5)</Form.Label>
          <Form.Control type="number" min="1" max="5" name="jobCategory" required />
        </Form.Group>

        {/* الراتب */}
        <Form.Group>
          <Form.Label>الراتب (بالدولار)</Form.Label>
          <Form.Control type="number" step="0.01" name="salary" required />
        </Form.Group>

        {/* المهام */}
        <Form.Group>
          <Form.Label>المهام</Form.Label>
          <Form.Control as="textarea" rows={3} name="task" required />
        </Form.Group>

        {/* القسم والشعبة تظهر فقط عند اختيار متوفر */}
   {need === "متوفر" && (
          <>
            <Form.Group>
              <Form.Label>القسم</Form.Label>
              {currentUser.role === "departementManager" || currentUser.role === "divisionManager" ? (
                <Form.Control value={currentUser.departmentName} readOnly />
              ) : (
                <Select
                  options={departments}
                  name="department"
                  placeholder="اختر القسم"
                  isSearchable
                  value={selectedDepartment}
                  onChange={(val) => setSelectedDepartment(val)}
                />
              )}
            </Form.Group>

            <Form.Group>
              <Form.Label>الشعبة</Form.Label>
              {currentUser.role === "divisionManager" ? (
                <Form.Control value={currentUser.divisionName} readOnly />
              ) : (
                <Select
                  options={filteredDivisions}
                  name="division"
                  placeholder="اختر الشعبة"
                  isSearchable
                />
              )}
            </Form.Group>
          </>
        )}

        <Button type="submit" className="mt-3">حفظ الموظف</Button>
      </Form>
    </div>
  );
}
