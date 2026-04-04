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
import { useNavigate } from "react-router-dom";

export default function ServicesList() {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [filterTarget, setFilterTarget] = useState("");
  const [filterInstitution, setFilterInstitution] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const navigate = useNavigate(); // ← مهم جداً

  const loadServices = async () => {
    const snapshot = await getDocs(collection(db, "services"));
    setServices(snapshot.docs.map((docu) => ({ id: docu.id, ...docu.data() })));
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleEdit = (service) => {
    setEditingService({ ...service });
    setShowModal(true);
  };

  const handleSaveEdit = async () => {
    const ref = doc(db, "services", editingService.id);
    await updateDoc(ref, editingService);
    setShowModal(false);
    loadServices();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل تريد حذف هذه الخدمة؟")) return;
    await deleteDoc(doc(db, "services", id));
    loadServices();
  };

 
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.target?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTarget = filterTarget ? service.target === filterTarget : true;
    const matchesInstitution = filterInstitution
      ? service.otherInstitution === filterInstitution
      : true;

    return matchesSearch && matchesTarget && matchesInstitution;
  });

  return (
    <div className="p-3">
      <h3>عرض الخدمات</h3>

      {/* زر إضافة يظهر فقط لغير مدير النظام */}
      {currentUser?.role !== "systemAdmin" && (
        <div className="d-flex justify-content-end mb-3">
          <Button variant="primary" onClick={() => navigate("/add")}>
            إضافة خدمة جديدة
          </Button>
        </div>
      )}

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
            {/* عمود الإجراءات يظهر فقط لغير مدير النظام */}
            {currentUser?.role !== "systemAdmin" && <th>إجراءات</th>}
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
              {currentUser?.role !== "systemAdmin" && (
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
              )}
            </tr>
          ))}
        </tbody>
      </Table>

  

      {/* نافذة التعديل */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
  <Modal.Header closeButton>
    <Modal.Title>تعديل الخدمة</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    {editingService && (
      <Form>
        {/* اسم الخدمة */}
        <Form.Group className="mb-3">
          <Form.Label>اسم الخدمة *</Form.Label>
          <Form.Control
            value={editingService.name}
            onChange={(e) =>
              setEditingService({ ...editingService, name: e.target.value })
            }
            required
          />
        </Form.Group>

        {/* تفاصيل الخدمة */}
        <Form.Group className="mb-3">
          <Form.Label>تفاصيل الخدمة *</Form.Label>
          <Form.Control
            value={editingService.details}
            onChange={(e) =>
              setEditingService({ ...editingService, details: e.target.value })
            }
            required
          />
        </Form.Group>

        {/* المستهدف */}
        <Form.Group className="mb-3">
          <Form.Label>المستهدف *</Form.Label>
          <Form.Select
            value={editingService.target}
            onChange={(e) =>
              setEditingService({ ...editingService, target: e.target.value })
            }
            required
          >
            <option value="">اختر المستهدف</option>
            <option value="موظفين">موظفين</option>
            <option value="شركات">شركات</option>
            <option value="مجتمع مدني">مجتمع مدني</option>
            <option value="طلاب">طلاب</option>
            <option value="أخرى">أخرى</option>
          </Form.Select>
        </Form.Group>

        {editingService.target === "أخرى" && (
          <Form.Group className="mb-3">
            <Form.Label>حدد المستهدف *</Form.Label>
            <Form.Control
              value={editingService.otherTarget || ""}
              onChange={(e) =>
                setEditingService({ ...editingService, otherTarget: e.target.value })
              }
              required
            />
          </Form.Group>
        )}

        {/* حالة الخدمة */}
        <Form.Group className="mb-3">
          <Form.Label>حالة الخدمة *</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={editingService.condition || ""}
            onChange={(e) =>
              setEditingService({ ...editingService, condition: e.target.value })
            }
            required
          />
        </Form.Group>

        {/* المؤسسة */}
        <Form.Group className="mb-3">
          <Form.Label>المؤسسة *</Form.Label>
          <Form.Select
            value={editingService.institution}
            onChange={(e) =>
              setEditingService({ ...editingService, institution: e.target.value })
            }
            required
          >
            <option value="">اختر المؤسسة</option>
            {syrianDirectorates.map((d, i) => (
              <option key={i} value={d}>{d}</option>
            ))}
            <option value="أخرى">أخرى</option>
          </Form.Select>
        </Form.Group>

        {editingService.institution === "أخرى" && (
          <Form.Group className="mb-3">
            <Form.Label>حدد المؤسسة *</Form.Label>
            <Form.Control
              value={editingService.otherInstitution || ""}
              onChange={(e) =>
                setEditingService({ ...editingService, otherInstitution: e.target.value })
              }
              required
            />
          </Form.Group>
        )}

        {/* السبب */}
        <Form.Group className="mb-3">
          <Form.Label>السبب *</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={editingService.reason || ""}
            onChange={(e) =>
              setEditingService({ ...editingService, reason: e.target.value })
            }
            required
          />
        </Form.Group>

        {/* طريقة الحصول */}
        <Form.Group className="mb-3">
          <Form.Label>طريقة الحصول *</Form.Label>
          <Form.Select
            value={editingService.gettingService || ""}
            onChange={(e) =>
              setEditingService({ ...editingService, gettingService: e.target.value })
            }
            required
          >
            <option value="">اختر الطريقة</option>
            <option value="حضور شخصي">حضور شخصي</option>
            <option value="وكيل">وكيل</option>
            <option value="أونلاين">أونلاين</option>
            <option value="مركز خدمة">مركز خدمة</option>
            <option value="أخرى">أخرى</option>
          </Form.Select>
        </Form.Group>

        {/* الكلفة */}
        <Form.Group className="mb-3">
          <Form.Label>الكلفة *</Form.Label>
          <Form.Select
            value={editingService.costType || "مجاني بالكامل"}
            onChange={(e) =>
              setEditingService({ ...editingService, costType: e.target.value })
            }
            required
          >
            <option value="مجاني بالكامل">مجاني بالكامل</option>
            <option value="رسوم">رسوم</option>
          </Form.Select>
        </Form.Group>

        {editingService.costType === "رسوم" && (
          <Row className="mb-3">
            <Col>
              <Form.Label>قيمة الرسوم *</Form.Label>
              <Form.Control
                type="number"
                value={editingService.costValue || ""}
                onChange={(e) =>
                  setEditingService({ ...editingService, costValue: e.target.value })
                }
                required
              />
            </Col>
            <Col>
              <Form.Label>العملة *</Form.Label>
              <Form.Select
                value={editingService.costCurrency || "USD"}
                onChange={(e) =>
                  setEditingService({ ...editingService, costCurrency: e.target.value })
                }
                required
              >
                <option value="USD">دولار</option>
                <option value="SYP">ليرة سورية</option>
              </Form.Select>
            </Col>
          </Row>
        )}

        {/* الكلفة الزمنية */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>الكلفة الزمنية *</Form.Label>
            <Form.Control
              type="number"
              value={editingService.timeCost || ""}
              onChange={(e) =>
                setEditingService({ ...editingService, timeCost: e.target.value })
              }
              required
            />
          </Col>
          <Col md={6}>
            <Form.Label>الوحدة *</Form.Label>
            <Form.Select
              value={editingService.timeUnit || "يوم"}
              onChange={(e) =>
                setEditingService({ ...editingService, timeUnit: e.target.value })
              }
            >
              <option value="يوم">يوم</option>
              <option value="ساعة">ساعة</option>
              <option value="شهر">شهر</option>
            </Form.Select>
          </Col>
        </Row>

        {/* المخرجات */}
        <Form.Group className="mb-3">
          <Form.Label>المخرجات *</Form.Label>
          <Form.Control
            value={editingService.output || ""}
            onChange={(e) =>
              setEditingService({ ...editingService, output: e.target.value })
            }
            required
          />
        </Form.Group>

        {/* المستفيدين */}
        <Form.Group className="mb-3">
          <Form.Label>متوسط المستفيدين شهريًا *</Form.Label>
          <Form.Control
            type="number"
            value={editingService.beneficiaries || ""}
            onChange={(e) =>
              setEditingService({ ...editingService, beneficiaries: e.target.value })
            }
            required
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
