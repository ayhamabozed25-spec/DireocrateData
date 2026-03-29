import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button, Table, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

export default function ProjectChallengesList() {
  const [projects, setProjects] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState(null);

  const navigate = useNavigate();

  // تحميل المشاريع
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

  // تحميل التحديات
  const loadChallenges = async () => {
    const snapshot = await getDocs(collection(db, "projectChallenges"));
    setChallenges(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    loadChallenges();
  }, []);

  const handleEdit = (ch) => {
    setEditingChallenge({ ...ch });
    setShowModal(true);
  };

  const handleSaveEdit = async () => {
    const ref = doc(db, "projectChallenges", editingChallenge.id);
    await updateDoc(ref, editingChallenge);
    setShowModal(false);
    loadChallenges();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل تريد حذف هذا التحدي؟")) return;
    await deleteDoc(doc(db, "projectChallenges", id));
    loadChallenges();
  };

  const filteredChallenges = challenges.filter(ch =>
    (ch.project || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ch.riskDescription || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-3">
      <h3>تحديات المشاريع</h3>

      {/* زر إضافة */}
      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" onClick={() => navigate("/add-project-challenge")}>
          إضافة تحدي جديد
        </Button>
      </div>

      {/* البحث */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-bold">بحث</Form.Label>
        <Form.Control
          type="text"
          placeholder="ابحث عن مشروع أو خطر..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      {/* جدول التحديات */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>المشروع</th>
            <th>الفئة</th>
            <th>الخطر</th>
            <th>الاحتمالية</th>
            <th>التأثير</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {filteredChallenges.map((ch) => (
            <tr key={ch.id}>
              <td>{ch.project}</td>
              <td>{ch.category}</td>
              <td>{ch.riskDescription}</td>
              <td>{ch.probability}%</td>
              <td>{ch.impact}%</td>
              <td>
                <Button
                  size="sm"
                  variant="warning"
                  className="me-2"
                  onClick={() => handleEdit(ch)}
                >
                  تعديل
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(ch.id)}
                >
                  حذف
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* نافذة التعديل */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>تعديل التحدي</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {editingChallenge && (
            <Form>

              {/* المشروع */}
              <Form.Group className="mb-3">
                <Form.Label>اسم المشروع</Form.Label>
                <Select
                  options={projects}
                  value={{ label: editingChallenge.project, value: editingChallenge.project }}
                  onChange={(selected) =>
                    setEditingChallenge({ ...editingChallenge, project: selected.value })
                  }
                />
              </Form.Group>

              {/* الفئة */}
              <Form.Group className="mb-3">
                <Form.Label>الفئة</Form.Label>
                <Form.Select
                  value={editingChallenge.category}
                  onChange={(e) =>
                    setEditingChallenge({ ...editingChallenge, category: e.target.value })
                  }
                >
                  <option value="تنظيمية">تنظيمية</option>
                  <option value="تشغيلية">تشغيلية</option>
                  <option value="مالية">مالية</option>
                  <option value="إجرائية/تشريعية">إجرائية/تشريعية</option>
                </Form.Select>
              </Form.Group>

              {/* وصف الخطر */}
              <Form.Group className="mb-3">
                <Form.Label>وصف الخطر</Form.Label>
                <Form.Control
                  value={editingChallenge.riskDescription}
                  onChange={(e) =>
                    setEditingChallenge({ ...editingChallenge, riskDescription: e.target.value })
                  }
                />
              </Form.Group>

              {/* الاحتمالية */}
              <Form.Group className="mb-3">
                <Form.Label>الاحتمالية (%)</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  max="100"
                  value={editingChallenge.probability}
                  onChange={(e) =>
                    setEditingChallenge({ ...editingChallenge, probability: e.target.value })
                  }
                />
              </Form.Group>

              {/* التأثير */}
              <Form.Group className="mb-3">
                <Form.Label>التأثير (%)</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  max="100"
                  value={editingChallenge.impact}
                  onChange={(e) =>
                    setEditingChallenge({ ...editingChallenge, impact: e.target.value })
                  }
                />
              </Form.Group>

              {/* الحل */}
              <Form.Group className="mb-3">
                <Form.Label>الحل المقترح</Form.Label>
                <Form.Control
                  value={editingChallenge.suggestion}
                  onChange={(e) =>
                    setEditingChallenge({ ...editingChallenge, suggestion: e.target.value })
                  }
                />
              </Form.Group>

            </Form>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            إلغاء
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            حفظ التعديلات
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
