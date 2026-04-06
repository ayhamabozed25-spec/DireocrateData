import { collection, addDoc, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import Select from "react-select";
import { useAuth } from "../components/AuthContext";

export default function AddDivision() {
  const [departments, setDepartments] = useState([]);
  const [userData, setUserData] = useState(null);

  const { currentUser } = useAuth();

  // جلب بيانات المستخدم الحالي
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

  // جلب الأقسام حسب الدور
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!userData) return;

      if (userData.role === "institutionManager") {
        const snapshot = await getDocs(collection(db, "departments"));
        const data = snapshot.docs
          .filter(doc => doc.data().institutionName === userData.name)
          .map(doc => ({
            value: doc.id,               // حفظ ID القسم
            label: doc.data().name       // عرض اسم القسم
          }));
        setDepartments(data);

      } else if (userData.role === "departmentManager") {
        setDepartments([
          {
            value: userData.departmentId,   // ID القسم
            label: userData.departmentName  // اسم القسم
          }
        ]);
      }
    };

    fetchDepartments();
  }, [userData]);

  // حفظ الشعبة
  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = e.target.name.value.trim();
    let departmentId;

    if (userData?.role === "institutionManager") {
      departmentId = e.target.department.value; // هذا هو ID القسم
    } else {
      departmentId = userData?.departmentId;
    }

    if (!name || !departmentId) {
      alert("اسم الشعبة والقسم إلزاميان ❌");
      return;
    }

    await addDoc(collection(db, "divisions"), {
      name,
      departmentId,          // حفظ ID القسم فقط
      email: currentUser.email
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

        <Button type="submit" className="mt-3">حفظ الشعبة</Button>
      </Form>
    </div>
  );
}
