import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button, Table, Modal, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import MapPicker from "./MapPicker";

export default function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const navigate = useNavigate();

  const loadProjects = async () => {
    const snapshot = await getDocs(collection(db, "projects"));
    setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleEdit = (project) => {
    setEditingProject({ ...project });
    setShowModal(true);
  };

  const handleSaveEdit = async () => {
    const ref = doc(db, "projects", editingProject.id);
    await updateDoc(ref, editingProject);
    setShowModal(false);
    loadProjects();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل تريد حذف هذا المشروع؟")) return;
    await deleteDoc(doc(db, "projects", id));
    loadProjects();
  };

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-3">
      <h3>المشاريع</h3>

      {/* زر إضافة */}
      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" onClick={() => navigate("/add-project")}>
          إضافة مشروع جديد
        </Button>
      </div>

      {/* البحث */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-bold">بحث</Form.Label>
        <Form.Control
          type="text"
          placeholder="ابحث عن مشروع..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      {/* جدول المشاريع */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>الاسم</th>
            <th>التفاصيل</th>
            <th>الميزانية</th>
            <th>العملة</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.details}</td>
              <td>{p.budget}</td>
              <td>{p.currency}</td>
              <td>
                <Button size="sm" variant="warning" className="me-2" onClick={() => handleEdit(p)}>
                  تعديل
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(p.id)}>
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
          <Modal.Title>تعديل المشروع</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {editingProject && (
            <Form>

              <Form.Group className="mb-3">
                <Form.Label>اسم المشروع</Form.Label>
                <Form.Control
                  value={editingProject.name}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, name: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>تفاصيل المشروع</Form.Label>
                <Form.Control
                  value={editingProject.details}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, details: e.target.value })
                  }
                />
              </Form.Group>

              {/* الخريطة */}
              <Form.Group className="mb-3">
                <Form.Label>الموقع</Form.Label>
                <MapPicker
                  onSelect={(loc) =>
                    setEditingProject({ ...editingProject, location: loc })
                  }
                />
                {editingProject.location && (
                  <div className="mt-2 text-success">
                    الموقع الحالي: {editingProject.location.lat},{" "}
                    {editingProject.location.lng}
                  </div>
                )}
              </Form.Group>

              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>تاريخ البدء</Form.Label>
                    <Form.Control
                      type="date"
                      value={editingProject.startDate}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, startDate: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>تاريخ الانتهاء</Form.Label>
                    <Form.Control
                      type="date"
                      value={editingProject.endDate}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, endDate: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>الميزانية</Form.Label>
                    <Form.Control
                      type="number"
                      value={editingProject.budget}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, budget: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>العملة</Form.Label>
                    <Form.Select
                      value={editingProject.currency}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, currency: e.target.value })
                      }
                    >
                      <option value="USD">دولار أمريكي</option>
                      <option value="SYP">ليرة سورية</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

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
