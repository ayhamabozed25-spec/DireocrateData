import { collection, addDoc, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import Select from "react-select";
import { AuthContext } from "../components/AuthContext"; // استدعاء الـ AuthContext

export default function AddDivision() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [userData, setUserData] = useState(null);

  const { currentUser } = useContext(AuthContext); // الحصول على المستخدم الحالي من الـ Context

  // جلب بيانات المستخدم الحالي من جدول dir_users
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      const userDoc = await getDoc(doc(db, "dir_users", currentUser.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    };
    fetchUserData();
  }, [currentUser]);

  // جلب الموظفين حسب الدور
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!userData) return;

      const snapshot = await getDocs(collection(db, "employees"));
      let data = snapshot.docs.map(doc => ({
        value: doc.data().name,
        label: doc.data().name,
        departmentName: doc.data().departmentName,
        institutionName: doc.data().institutionName
      }));

      if (userData.role === "institutionManager") {
        // موظفي المؤسسة فقط
        data = data.filter(emp => emp.institutionName === userData.name);
      } else if (userData.role === "departmentManager") {
        // موظفي القسم ضمن المؤسسة
        data = data.filter(
          emp =>
            emp.institutionName === userData.name &&
            emp.departmentName === userData.departmentName
        );
      }

      setEmployees(data);
    };
    fetchEmployees();
  }, [userData]);

  // جلب الأقسام حسب الدور
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!userData) return;

      if (userData.role === "institutionManager") {
        const snapshot = await getDocs(collection(db, "departments"));
        const data = snapshot.docs
          .filter(doc => doc.data().institutionName === userData.name)
          .map(doc => ({
            value: doc.data().name,
            label: doc.data().name
          }));
        setDepartments(data);
      } else if (userData.role === "departmentManager") {
        setDepartments([{ value: userData.departmentName, label: userData.departmentName }]);
      }
    };
    fetchDepartments();
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = e.target.name.value.trim();
    let department;
    if (userData?.role === "institutionManager") {
      department = e.target.department.value;
    } else {
      department = userData?.departmentName;
    }
    const head = e.target.head.value;

    if (!name || !department) {
      alert("اسم الشعبة والقسم إلزاميان ❌");
      return;
    }

    await addDoc(collection(db, "divisions"), { 
      name, 
      department, 
      head, 
      email: currentUser.email // حفظ إيميل المستخدم الحالي
    });

    alert("تم حفظ الشعبة بنجاح");
    e.target.reset();
  };

  return (
    <div className="p-3">
      <h3>إضافة شعبة جديدة</h3>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>اسم الشعبة</Form.Label>
          <Form.Control name="name" required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>القسم التابع له</Form.Label>
          {userData?.role === "institutionManager" ? (
            <Select
              options={departments}
              name="department"
              placeholder="اختر القسم"
              isSearchable
            />
          ) : (
            <Form.Control
              name="department"
              value={userData?.departmentName || ""}
              readOnly
            />
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>رئيس الشعبة</Form.Label>
          <Select
            options={employees}
            name="head"
            placeholder="اختر رئيس الشعبة"
            isSearchable
          />
        </Form.Group>

        <Button type="submit" className="mt-3">حفظ الشعبة</Button>
      </Form>
    </div>
  );
}
