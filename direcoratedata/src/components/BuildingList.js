import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button, Table, Modal, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function BuildingList() {
  const [buildings, setBuildings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState(null);

  const navigate = useNavigate();

  const loadBuildings = async () => {
    const snapshot = await getDocs(collection(db, "buildings"));
    setBuildings(snapshot.docs.map((docu) => ({ id: docu.id, ...docu.data() })));
  };

  useEffect(() => {
    loadBuildings();
  }, []);

  const handleEdit = (building) => {
    setEditingBuilding({ ...building });
    setShowModal(true);
  };

  const handleSaveEdit = async () => {
    const ref = doc(db, "buildings", editingBuilding.id);
    await updateDoc(ref, editingBuilding);
    setShowModal(false);
    loadBuildings();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل تريد حذف هذا البناء؟")) return;
    await deleteDoc(doc(db, "buildings", id));
    loadBuildings();
  };

  const filteredBuildings = buildings.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-3">
      <h3>الأبنية</h3>

      {/* زر إضافة */}
      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" onClick={() => navigate("/add-building")}>
          إضافة بناء جديد
        </Button>
      </div>

      {/* البحث */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-bold">بحث</Form.Label>
        <Form.Control
          type="text"
          placeholder="ابحث عن اسم بناء..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      {/* جدول الأبنية */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>الاسم</th>
            <th>الطوابق</th>
            <th>المكاتب</th>
            <th>الحالة الإنشائية</th>
            <th>السعة</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {filteredBuildings.map((b) => (
            <tr key={b.id}>
              <td>{b.name}</td>
              <td>{b.floors}</td>
              <td>{b.offices}</td>
              <td>{b.structuralCondition}</td>
              <td>{b.capacity}</td>
              <td>
                <Button
                  size="sm"
                  variant="warning"
                  className="me-2"
                  onClick={() => handleEdit(b)}
                >
                  تعديل
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(b.id)}
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
    <Modal.Title>تعديل معلومات البناء</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    {editingBuilding && (
      <Form>

        {/* اسم البناء */}
        <Form.Group className="mb-3">
          <Form.Label>اسم البناء</Form.Label>
          <Form.Control
            value={editingBuilding.name}
            onChange={(e) =>
              setEditingBuilding({ ...editingBuilding, name: e.target.value })
            }
          />
        </Form.Group>

        {/* الخريطة */}
        <Form.Group className="mb-3">
          <Form.Label>الخريطة</Form.Label>
          <Form.Control
            value={editingBuilding.map || ""}
            onChange={(e) =>
              setEditingBuilding({ ...editingBuilding, map: e.target.value })
            }
          />
        </Form.Group>

        {/* الملكية */}
        <Form.Group className="mb-3">
          <Form.Label>الملكية</Form.Label>
          <Form.Select
            value={editingBuilding.ownership}
            onChange={(e) =>
              setEditingBuilding({ ...editingBuilding, ownership: e.target.value })
            }
          >
            <option value="بناء حكومي">بناء حكومي</option>
            <option value="إيجار">إيجار</option>
            <option value="أخرى">أخرى</option>
          </Form.Select>
        </Form.Group>

        {editingBuilding.ownership === "أخرى" && (
          <Form.Group className="mb-3">
            <Form.Label>نوع الملكية الأخرى</Form.Label>
            <Form.Control
              value={editingBuilding.otherOwnership || ""}
              onChange={(e) =>
                setEditingBuilding({
                  ...editingBuilding,
                  otherOwnership: e.target.value,
                })
              }
            />
          </Form.Group>
        )}

        {/* الكلفة (تظهر فقط إذا لم يكن بناء حكومي) */}
        {editingBuilding.ownership !== "بناء حكومي" && (
          <Form.Group className="mb-3">
            <Form.Label>الكلفة</Form.Label>
            <div style={{ display: "flex", gap: "10px" }}>
              <Form.Control
                type="number"
                value={editingBuilding.cost || ""}
                onChange={(e) =>
                  setEditingBuilding({ ...editingBuilding, cost: e.target.value })
                }
              />
              <Form.Select
                value={editingBuilding.currency || "دولار"}
                onChange={(e) =>
                  setEditingBuilding({ ...editingBuilding, currency: e.target.value })
                }
              >
                <option value="دولار">دولار</option>
                <option value="ليرة سورية">ليرة سورية</option>
              </Form.Select>
            </div>
          </Form.Group>
        )}

        {/* الطوابق */}
        <Form.Group className="mb-3">
          <Form.Label>عدد الطوابق</Form.Label>
          <Form.Control
            type="number"
            value={editingBuilding.floors}
            onChange={(e) =>
              setEditingBuilding({ ...editingBuilding, floors: e.target.value })
            }
          />
        </Form.Group>

        {/* باقي الحقول كما هي ... */}

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
