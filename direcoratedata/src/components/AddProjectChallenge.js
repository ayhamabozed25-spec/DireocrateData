import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import Select from "react-select";

export default function AddProjectChallenge() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

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

  return (
    <div className="p-3">
      <h3>إضافة تحدي جديد للمشروع</h3>

      <Form onSubmit={handleSubmit}>

        {/* المشروع */}
        <Form.Group className="mb-3">
          <Form.Label>اسم المشروع *</Form.Label>
          <Select
            options={projects}
            placeholder="اختر المشروع"
            isSearchable
            value={selectedProject}
            onChange={setSelectedProject}
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
          <Form.Control type="number" name="probability" min="0" max="100" required />
        </Form.Group>

        {/* التأثير */}
        <Form.Group className="mb-3">
          <Form.Label>التأثير (%) *</Form.Label>
          <Form.Control type="number" name="impact" min="0" max="100" required />
        </Form.Group>

        {/* الحل */}
        <Form.Group className="mb-3">
          <Form.Label>الحل المقترح *</Form.Label>
          <Form.Control name="suggestion" required />
        </Form.Group>

        <Button type="submit" className="mt-3">حفظ التحدي</Button>
      </Form>
    </div>
  );
}
