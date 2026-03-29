import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import Select from "react-select";

export default function ProjectChallengesForm() {
  const [projects, setProjects] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  // جلب المشاريع
  useEffect(() => {
    const fetchProjects = async () => {
      const snapshot = await getDocs(collection(db, "projects"));
      const data = snapshot.docs.map(doc => ({
        value: doc.data().name || "",
        label: doc.data().name || ""
      }));
      setProjects(data);
    };
    fetchProjects();
  }, []);

  // جلب التحديات
  useEffect(() => {
    const fetchChallenges = async () => {
      const snapshot = await getDocs(collection(db, "projectChallenges"));
      setChallenges(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchChallenges();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProject) {
      alert("يجب اختيار مشروع");
      return;
    }

    await addDoc(collection(db, "projectChallenges"), {
      project: selectedProject.value,
      category: e.target.category.value,
      riskDescription: e.target.riskDescription.value,
      probability: e.target.probability.value,
      impact: e.target.impact.value,
      suggestion: e.target.suggestion.value,
    });

    alert("تم حفظ التحدي بنجاح");
    e.target.reset();
    setSelectedProject(null);
  };

  // فلترة التحديات بشكل آمن
  const filteredChallenges = challenges.filter(ch => {
    const project = ch.project || "";
    const risk = ch.riskDescription || "";
    return (
      project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      risk.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="p-3">
      <h3>إضافة تحدي جديد للمشروع</h3>

      {/* حقل البحث */}
      <Form.Group className="mb-4">
        <Form.Label style={{ fontWeight: "bold" }}>🔍 بحث عن تحدي</Form.Label>
        <Form.Control
          type="text"
          placeholder="ابحث باسم المشروع أو وصف الخطر..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            borderRadius: "10px",
            padding: "10px",
            border: "2px solid #ddd",
          }}
        />
      </Form.Group>

      {/* نتائج البحث */}
      {searchTerm && filteredChallenges.length > 0 && (
        <ul style={{ background: "#f7f7f7", padding: "15px", borderRadius: "10px" }}>
          {filteredChallenges.map((ch) => (
            <li key={ch.id}>
              <strong>المشروع:</strong> {ch.project} — 
              <strong> الخطر:</strong> {ch.riskDescription} — 
              <strong> الفئة:</strong> {ch.category}
            </li>
          ))}
        </ul>
      )}

      {searchTerm && filteredChallenges.length === 0 && (
        <div className="text-danger">لا توجد نتائج مطابقة</div>
      )}

      {/* نموذج إضافة التحدي */}
      <Form onSubmit={handleSubmit} className="mt-4">

        {/* اختيار المشروع */}
        <Form.Group className="mb-3">
          <Form.Label>اسم المشروع *</Form.Label>
          <Select
            options={projects}
            name="project"
            placeholder="اختر المشروع"
            isSearchable
            value={selectedProject}
            onChange={setSelectedProject}
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "10px",
                borderColor: "#aaa",
              }),
            }}
          />
        </Form.Group>

        {/* الفئة */}
        <Form.Group className="mb-3">
          <Form.Label>الفئة *</Form.Label>
          <Form.Select name="category" required>
            <option value="">اختر الفئة</option>
            <option value="تنظيمية">تنظيمية</option>
            <option value="تشغيلية">تشغيلية</option>
            <option value="مالية">مالية</option>
            <option value="إجرائية/تشريعية">إجرائية/تشريعية</option>
          </Form.Select>
        </Form.Group>

        {/* وصف الخطر */}
        <Form.Group className="mb-3">
          <Form.Label>وصف الخطر *</Form.Label>
          <Form.Control name="riskDescription" required />
        </Form.Group>

        {/* الاحتمالية */}
        <Form.Group className="mb-3">
          <Form.Label>الاحتمالية (%) *</Form.Label>
          <Form.Control
            type="number"
            name="probability"
            min="0"
            max="100"
            required
          />
        </Form.Group>

        {/* التأثير */}
        <Form.Group className="mb-3">
          <Form.Label>التأثير (%) *</Form.Label>
          <Form.Control
            type="number"
            name="impact"
            min="0"
            max="100"
            required
          />
        </Form.Group>

        {/* الحل */}
        <Form.Group className="mb-3">
          <Form.Label>الحل المقترح *</Form.Label>
          <Form.Control name="suggestion" required />
        </Form.Group>

        <Button type="submit" className="mt-3" variant="primary">
          حفظ التحدي
        </Button>
      </Form>
    </div>
  );
}
