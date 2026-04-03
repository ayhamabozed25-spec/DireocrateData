import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button, Table, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useAuth } from "../contexts/AuthContext"; // تأكد من المسار الصحيح

export default function DepartmentsList() {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingDep, setEditingDep] = useState(null);

  const navigate = useNavigate();
  const { currentUser } = useAuth(); // المستخدم الحالي

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

  // تحميل الأقسام الخاصة بالمستخدم الحالي
  const loadDepartments = async () => {
    if (!currentUser) return;

    let q;
    // إذا كان المستخدم مدير النظام نعرض كل الأقسام
    if (currentUser.role === "admin") {
      q = collection(db, "departments");
    } else {
      // غير ذلك نعرض الأقسام التي أنشأها هو فقط
      q = query(collection(db, "departments"), where("managerEmail", "==", currentUser.email));
    }

    const snapshot = await getDocs(q);
    setDepartments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    loadDepartments();
  }, [currentUser]);

  const handleEdit = (dep) => {
    setEditingDep({ ...dep });
    setShowModal(true);
  };

  const handleSaveEdit = async () => {
    const ref = doc(db, "departments", editingDep.id);
    await updateDoc(ref, editingDep);
    setShowModal(false);
    loadDepartments();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل تريد حذف هذا القسم؟")) return;
    await deleteDoc(doc(db, "departments", id));
    loadDepartments();
  };

  const filteredDepartments = departments.filter(dep =>
    dep.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-3">
      <h3>الأقسام</h3>

      {/* زر إضافة يظهر فقط لغير المدير العام */}
      {currentUser?.role !== "admin" && (
        <div className="d-flex justify-content-end mb-3">
          <Button variant="primary" onClick={() => navigate("/add-department")}>
            إضافة قسم جديد
          </Button>
        </div>
      )}

      {/* البحث */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-bold">بحث</Form.Label>
        <Form.Control
          type="text"
          placeholder="ابحث عن قسم..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      {/* جدول الأقسام */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>اسم القسم</th>
            <th>رئيس القسم</th>
            {/* عمود الإجراءات يظهر فقط لغير المدير العام */}
            {currentUser?.role !== "admin" && <th>إجراءات</th>}
          </tr>
        </thead>
        <tbody>
          {filteredDepartments.map((dep) => (
            <tr key={dep.id}>
              <td>{dep.name}</td>
              <td>{dep.head}</td>
              {currentUser?.role !== "admin" && (
                <td>
                  <Button
                    size="sm"
                    variant="warning"
                    className="me-2"
                    onClick={() => handleEdit(dep)}
                  >
                    تعديل
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(dep.id)}
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
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>تعديل القسم</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {editingDep && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>اسم القسم</Form.Label>
                <Form.Control
                  value={editingDep.name}
                  onChange={(e) =>
                    setEditingDep({ ...editingDep, name: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>رئيس القسم</Form.Label>
                <Select
                  options={employees}
                  value={{ label: editingDep.head, value: editingDep.head }}
                  onChange={(selected) =>
                    setEditingDep({ ...editingDep, head: selected.value })
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
