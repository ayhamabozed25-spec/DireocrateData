import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import Select from "react-select";

export default function ProjectChallengesForm() {
  const [projects, setProjects] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // جلب المشاريع من قاعدة البيانات
  useEffect(() => {
    const fetchProjects = async () => {
      const snapshot = await getDocs(collection(db, "projects"));
      const data = snapshot.docs.map(doc => ({
        value: doc.data().name,
        label: doc.data().name
      }));
      setProjects(data);
    };
    fetchProjects();
  }, []);

  // جلب التحديات من قاعدة البيانات
  useEffect(() => {
    const fetchChallenges = async () => {
      const snapshot = await getDocs(collection(db, "projectChallenges"));
      setChallenges(snapshot.docs.map(doc => doc.data()));
    };
    fetchChallenges();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "projectChallenges"), {
      project: e.target.project.value,
      category: e.target.category.value,
      riskDescription: e.target.riskDescription.value,
      probability: e.target.probability.value,
      impact: e.target.impact.value,
      suggestion: e.target.suggestion.value,
    });
    alert("تم حفظ التحدي ✅");
    e.target.reset();
  };

  // فلترة التحديات حسب البحث
  const filteredChallenges = challenges.filter(ch =>
    ch.riskDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ch.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-3">
      <h3>إضافة تحدي جديد للمشروع</h3>

      {/* زر البحث عن التحديات */}
      <Form.Group className="mb-3">
        <Form.Label>بحث عن تحدي</Form.Label>
        <Form.Control
          type="text"
          placeholder="أدخل اسم المشروع أو وصف الخطر"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      {/* عرض نتائج البحث */}
      {searchTerm && (
        <ul>
          {filteredChallenges.map((ch, index) => (
            <li key={index}>
              المشروع: {ch.project} - الخطر: {ch.riskDescription} - الفئة: {ch.category}
            </li>
          ))}
        </ul>
      )}

      {/* نموذج إضافة تحدي */}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>اسم المشروع</Form.Label>
          <Select
            options={projects}
            name="project"
            placeholder="اختر المشروع"
            isSearchable
          />
        </Form.Group>

        <Form.Group><Form.Label>الفئة</Form.Label><Form.Control name="category" /></Form.Group>
        <Form.Group><Form.Label>وصف الخطر</Form.Label><Form.Control name="riskDescription" /></Form.Group>
        <Form.Group><Form.Label>الاحتمالية</Form.Label><Form.Control name="probability" /></Form.Group>
        <Form.Group><Form.Label>التأثير</Form.Label><Form.Control name="impact" /></Form.Group>
        <Form.Group><Form.Label>الحل المقترح</Form.Label><Form.Control name="suggestion" /></Form.Group>

        <Button type="submit" className="mt-3">حفظ التحدي</Button>
      </Form>
    </div>
  );
}
