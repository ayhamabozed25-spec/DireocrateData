import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button, Table, Modal, Row, Col, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function SwotList() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const navigate = useNavigate(); // ← مهم جداً

  const loadItems = async () => {
    const snapshot = await getDocs(collection(db, "swot"));
    setItems(snapshot.docs.map((docu) => ({ id: docu.id, ...docu.data() })));
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleEdit = (item) => {
    setEditingItem({ ...item });
    setShowModal(true);
  };

  const handleSaveEdit = async () => {
    const ref = doc(db, "swot", editingItem.id);
    await updateDoc(ref, editingItem);
    setShowModal(false);
    loadItems();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل تريد حذف هذا العنصر؟")) return;
    await deleteDoc(doc(db, "swot", id));
    loadItems();
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType ? item.type === filterType : true;

    return matchesSearch && matchesType;
  });

  return (
    <div className="p-3">
      <h3>عناصر SWOT</h3>

      {/* زر إضافة */}
      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" onClick={() => navigate("/add-swot")}>
          إضافة عنصر جديد
        </Button>
      </div>

      {/* البحث */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-bold">بحث</Form.Label>
        <Form.Control
          type="text"
          placeholder="ابحث عن وصف أو نوع..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      {/* الفلترة */}
      <Row className="mb-4">
        <Col md={6}>
          <Form.Label>فلترة حسب النوع</Form.Label>
          <Form.Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">الكل</option>
            <option value="قوة">قوة</option>
            <option value="ضعف">ضعف</option>
            <option value="فرصة">فرصة</option>
            <option value="خطر">خطر</option>
          </Form.Select>
        </Col>
      </Row>

      {/* الجدول */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>النوع</th>
            <th>الوصف</th>
            <th>درجة الأهمية</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.id}>
              <td>
                <Badge
                  bg={
                    item.type === "قوة"
                      ? "success"
                      : item.type === "ضعف"
                      ? "danger"
                      : item.type === "فرصة"
                      ? "info"
                      : "warning"
                  }
                >
                  {item.type}
                </Badge>
              </td>
              <td>{item.description}</td>
              <td>{item.priority}</td>
              <td>
                <Button
                  size="sm"
                  variant="warning"
                  className="me-2"
                  onClick={() => handleEdit(item)}
                >
                  تعديل
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(item.id)}
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
          <Modal.Title>تعديل العنصر</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {editingItem && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>النوع</Form.Label>
                <Form.Select
                  value={editingItem.type}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, type: e.target.value })
                  }
                >
                  <option value="قوة">قوة</option>
                  <option value="ضعف">ضعف</option>
                  <option value="فرصة">فرصة</option>
                  <option value="خطر">خطر</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>الوصف</Form.Label>
                <Form.Control
                  value={editingItem.description}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, description: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>درجة الأهمية</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max="5"
                  value={editingItem.priority}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, priority: e.target.value })
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
