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
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>تعديل معلومات البناء</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {editingBuilding && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>اسم البناء</Form.Label>
                <Form.Control
                  value={editingBuilding.name}
                  onChange={(e) =>
                    setEditingBuilding({ ...editingBuilding, name: e.target.value })
                  }
                />
              </Form.Group>

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

              <Form.Group className="mb-3">
                <Form.Label>عدد المكاتب</Form.Label>
                <Form.Control
                  type="number"
                  value={editingBuilding.offices}
                  onChange={(e) =>
                    setEditingBuilding({ ...editingBuilding, offices: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>الحالة الإنشائية</Form.Label>
                <Form.Control
                  value={editingBuilding.structuralCondition}
                  onChange={(e) =>
                    setEditingBuilding({
                      ...editingBuilding,
                      structuralCondition: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>السعة</Form.Label>
                <Form.Control
                  type="number"
                  value={editingBuilding.capacity}
                  onChange={(e) =>
                    setEditingBuilding({ ...editingBuilding, capacity: e.target.value })
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
