import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  Form,
  Button,
  Table,
  Modal,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import { syrianDirectorates } from "./directorates";

export default function ServicesList() {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [filterTarget, setFilterTarget] = useState("");
  const [filterInstitution, setFilterInstitution] = useState("");

  // التعديل
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const loadServices = async () => {
    const snapshot = await getDocs(collection(db, "services"));
    setServices(snapshot.docs.map((docu) => ({ id: docu.id, ...docu.data() })));
  };

  useEffect(() => {
    loadServices();
  }, []);

  // فتح نافذة التعديل
  const handleEdit = (service) => {
    setEditingService({ ...service });
    setShowModal(true);
  };

  // حفظ التعديل
  const handleSaveEdit = async () => {
    const ref = doc(db, "services", editingService.id);
    await updateDoc(ref, editingService);
    setShowModal(false);
    loadServices();
  };

  // حذف خدمة
  const handleDelete = async (id) => {
    if (!window.confirm("هل تريد حذف هذه الخدمة؟")) return;
    await deleteDoc(doc(db, "services", id));
    loadServices();
  };

  // فلترة النتائج
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.target?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTarget = filterTarget
      ? service.target === filterTarget
      : true;

    const matchesInstitution = filterInstitution
      ? service.otherInstitution === filterInstitution
      : true;

    return matchesSearch && matchesTarget && matchesInstitution;
  });

  return (
    <div className="p-3">
      <h3>عرض الخدمات</h3>

      {/* زر إضافة خدمة */}
      <div className="d-flex justify-content-end mb-3">
        <Button
          variant="primary"
          onClick={() => (window.location.href = "/add")}
        >
          إضافة خدمة جديدة
        </Button>
      </div>

      {/* 🔍 البحث */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-bold">بحث</Form.Label>
        <Form.Control
          type="text"
          placeholder="ابحث باسم الخدمة أو التفاصيل أو المستهدف..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      {/* الفلاتر */}
      <Row className="mb-4">
        <Col md={6}>
          <Form.Label>فلترة حسب المستهدف</Form.Label>
          <Form.Select
            value={filterTarget}
            onChange={(e) => setFilterTarget(e.target.value)}
          >
            <option value="">الكل</option>
            <option value="موظفين">موظفين</option>
            <option value="شركات">شركات</option>
            <option value="مجتمع مدني">مجتمع مدني</option>
            <option value="طلاب">طلاب</option>
          </Form.Select>
        </Col>

        <Col md={6}>
          <Form.Label>فلترة حسب المؤسسة</Form.Label>
          <Form.Select
            value={filterInstitution}
            onChange={(e) => setFilterInstitution(e.target.value)}
          >
            <option value="">الكل</option>
            {syrianDirectorates.map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* جدول الخدمات */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>الاسم</th>
            <th>المستهدف</th>
            <th>المؤسسة</th>
            <th>الكلفة</th>
            <th>الزمن</th>
            <th>المستفيدين</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {filteredServices.map((service) => (
            <tr key={service.id}>
              <td>{service.name}</td>
              <td>{service.target}</td>
              <td>{service.otherInstitution}</td>
              <td>
                {service.cost === "مجاني بالكامل" ? (
                  <Badge bg="success">مجاني</Badge>
                ) : (
                  service.cost
                )}
              </td>
              <td>{service.timeCost}</td>
              <td>{service.beneficiaries}</td>
              <td>
                <Button
                  size="sm"
                  variant="warning"
                  className="me-2"
                  onClick={() => handleEdit(service)}
                >
                  تعديل
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(service.id)}
                >
                  حذف
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* نافذة التعديل */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>تعديل الخدمة</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {editingService && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>اسم الخدمة</Form.Label>
                <Form.Control
                  value={editingService.name}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      name: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>التفاصيل</Form.Label>
                <Form.Control
                  value={editingService.details}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      details: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>المستهدف</Form.Label>
                <Form.Control
                  value={editingService.target}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      target: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>المؤسسة</Form.Label>
                <Form.Select
                  value={editingService.otherInstitution}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      otherInstitution: e.target.value,
                    })
                  }
                >
                  {syrianDirectorates.map((d, i) => (
                    <option key={i} value={d}>
                      {d}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>الكلفة</Form.Label>
                <Form.Control
                  value={editingService.cost}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      cost: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>الزمن</Form.Label>
                <Form.Control
                  value={editingService.timeCost}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      timeCost: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>المستفيدين</Form.Label>
                <Form.Control
                  type="number"
                  value={editingService.beneficiaries}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      beneficiaries: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </>
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
