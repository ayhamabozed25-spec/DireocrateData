import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button, Table, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

export default function DivisionsList() {
  const [divisions, setDivisions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingDiv, setEditingDiv] = useState(null);

  const navigate = useNavigate();

  // تحميل الموظفين
  useEffect(() => {
    const fetchEmployees = async () => {
      const snapshot = await getDocs(collection(db, "employees"));
      const data = snapshot.docs.map(doc => ({
        value: doc.data().name,
        label: doc.data().name
      }));
      setEmployees(data);
    };
    fetchEmployees();
  }, []);

  // تحميل الأقسام
  useEffect(() => {
    const fetchDepartments = async () => {
      const snapshot = await getDocs(collection(db, "departments"));
      const data = snapshot.docs.map(doc => ({
        value: doc.data().name,
        label: doc.data().name
      }));
      setDepartments(data);
    };
    fetchDepartments();
  }, []);

  // تحميل الشعب
  const loadDivisions = async () => {
    const snapshot = await getDocs(collection(db, "divisions"));
    setDivisions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    loadDivisions();
  }, []);

  const handleEdit = (div) => {
    setEditingDiv({ ...div });
    setShowModal(true);
  };

  const handleSaveEdit = async () => {
    const ref = doc(db, "divisions", editingDiv.id);
    await updateDoc(ref, editingDiv);
    setShowModal(false);
    loadDivisions();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل تريد حذف هذه الشعبة؟")) return;
    await deleteDoc(doc(db, "divisions", id));
    loadDivisions();
  };

  const filteredDivisions = divisions.filter(div =>
    div.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-3">
      <h3>الشُّعَب</h3>

      {/* زر إضافة */}
      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" onClick={() => navigate("/add-division")}>
          إضافة شعبة جديدة
        </Button>
      </div>

      {/* البحث */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-bold">بحث</Form.Label>
        <Form.Control
          type="text"
          placeholder="ابحث عن شعبة..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      {/* جدول الشعب */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>اسم الشعبة</th>
            <th>القسم التابع له</th>
            <th>رئيس الشعبة</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {filteredDivisions.map((div) => (
            <tr key={div.id}>
              <td>{div.name}</td>
              <td>{div.department}</td>
              <td>{div.head}</td>
              <td>
                <Button
                  size="sm"
                  variant="warning"
                  className="me-2"
                  onClick={() => handleEdit(div)}
                >
                  تعديل
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(div.id)}
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
          <Modal.Title>تعديل الشعبة</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {editingDiv && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>اسم الشعبة</Form.Label>
                <Form.Control
                  value={editingDiv.name}
                  onChange={(e) =>
                    setEditingDiv({ ...editingDiv, name: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>القسم التابع له</Form.Label>
                <Select
                  options={departments}
                  value={{ label: editingDiv.department, value: editingDiv.department }}
                  onChange={(selected) =>
                    setEditingDiv({ ...editingDiv, department: selected.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>رئيس الشعبة</Form.Label>
                <Select
                  options={employees}
                  value={{ label: editingDiv.head, value: editingDiv.head }}
                  onChange={(selected) =>
                    setEditingDiv({ ...editingDiv, head: selected.value })
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
