import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button, Table, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useAuth } from "../components/AuthContext"; // استدعاء السياق

export default function FurnitureList() {
  const [furniture, setFurniture] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // تحميل الموظفين حسب الدور
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!currentUser) return;

      let q;
      if (currentUser.role === "institutionManager") {
        q = query(collection(db, "employees"), where("institutionName", "==", currentUser.name));
      } else if (currentUser.role === "departementManager") {
        q = query(collection(db, "employees"), where("departmentName", "==", currentUser.departmentName));
      } else if (currentUser.role === "divisionManager") {
        q = query(collection(db, "employees"), where("divisionName", "==", currentUser.divisionName));
      } else {
        q = collection(db, "employees"); // مدير النظام يرى الجميع
      }

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        value: doc.data().name,
        label: doc.data().name
      }));
      setEmployees(data);
    };

    fetchEmployees();
  }, [currentUser]);

  // تحميل الأثاث حسب الدور
  const loadFurniture = async () => {
    if (!currentUser) return;

    let q;
    if (currentUser.role === "institutionManager") {
      q = query(collection(db, "furniture"), where("institutionName", "==", currentUser.name));
    } else if (currentUser.role === "departementManager") {
      q = query(collection(db, "furniture"), where("departmentName", "==", currentUser.departmentName));
    } else if (currentUser.role === "divisionManager") {
      q = query(collection(db, "furniture"), where("divisionName", "==", currentUser.divisionName));
    } else {
      q = collection(db, "furniture"); // مدير النظام يرى الجميع
    }

    const snapshot = await getDocs(q);
    setFurniture(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    loadFurniture();
  }, [currentUser]);

  const handleEdit = (item) => {
    setEditingItem({ ...item });
    setShowModal(true);
  };

  const handleSaveEdit = async () => {
    const ref = doc(db, "furniture", editingItem.id);
    await updateDoc(ref, {
      ...editingItem,
      managerEmail: currentUser?.email || null, // تحديث البريد الحالي عند التعديل
    });
    setShowModal(false);
    loadFurniture();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل تريد حذف هذا الأثاث؟")) return;
    await deleteDoc(doc(db, "furniture", id));
    loadFurniture();
  };

  const filteredFurniture = furniture.filter(item =>
    item.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-3">
      <h3>الأثاث</h3>

      {/* زر إضافة يظهر فقط لغير مدير النظام */}
      {currentUser?.role !== "systemAdmin" && (
        <div className="d-flex justify-content-end mb-3">
          <Button variant="primary" onClick={() => navigate("/add-furniture")}>
            إضافة أثاث جديد
          </Button>
        </div>
      )}

      {/* البحث */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-bold">بحث</Form.Label>
        <Form.Control
          type="text"
          placeholder="ابحث عن أثاث..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      {/* جدول الأثاث */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>النوع</th>
            <th>الكمية</th>
            <th>الموظف</th>
            <th>الحالة</th>
            {/* عمود الإجراءات يظهر فقط لغير مدير النظام */}
            {currentUser?.role !== "systemAdmin" && <th>إجراءات</th>}
          </tr>
        </thead>
        <tbody>
          {filteredFurniture.map((item) => (
            <tr key={item.id}>
              <td>{item.type}</td>
              <td>{item.quantity}</td>
              <td>{item.employee}</td>
              <td>{item.status}</td>
              {currentUser?.role !== "systemAdmin" && (
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
              )}
            </tr>
          ))}
        </tbody>
      </Table>


  return (
    <div className="p-3">
      <h3>الأثاث</h3>

      {/* زر إضافة */}
      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" onClick={() => navigate("/add-furniture")}>
          إضافة أثاث جديد
        </Button>
      </div>

      {/* البحث */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-bold">بحث</Form.Label>
        <Form.Control
          type="text"
          placeholder="ابحث عن أثاث..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      {/* جدول الأثاث */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>النوع</th>
            <th>الكمية</th>
            <th>الموظف</th>
            <th>الحالة</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {filteredFurniture.map((item) => (
            <tr key={item.id}>
              <td>{item.type}</td>
              <td>{item.quantity}</td>
              <td>{item.employee}</td>
              <td>{item.status}</td>
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
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>تعديل الأثاث</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {editingItem && (
            <Form>

              {/* الحاجة */}
              <Form.Group className="mb-3">
                <Form.Label>الحاجة</Form.Label>
                <Form.Select
                  value={editingItem.need}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, need: e.target.value })
                  }
                >
                  <option value="متوفر">متوفر</option>
                  <option value="مطلوب">مطلوب</option>
                </Form.Select>
              </Form.Group>

              {/* النوع */}
          <Form.Group className="mb-3">
  <Form.Label>نوع الأثاث</Form.Label>
  <Form.Select
    value={editingItem.type}
    onChange={(e) =>
      setEditingItem({ ...editingItem, type: e.target.value })
    }
    required
  >
    <option value="">اختر</option>
    <option value="طاولة مكتب">طاولة مكتب</option>
    <option value="كرسي مكتب">كرسي مكتب</option>
    <option value="طاولة اجتماعات">طاولة اجتماعات</option>
    <option value="أريكة">أريكة</option>
    <option value="خزانة ملفات">خزانة ملفات</option>
    <option value="مكتبة">مكتبة</option>
    <option value="أخرى">أخرى</option>
  </Form.Select>
</Form.Group>

{/* إذا اختار "أخرى" يظهر حقل إضافي */}
{editingItem.type === "أخرى" && (
  <Form.Group className="mb-3">
    <Form.Label>نوع آخر</Form.Label>
    <Form.Control
      value={editingItem.otherType || ""}
      onChange={(e) =>
        setEditingItem({ ...editingItem, otherType: e.target.value })
      }
      required
    />
  </Form.Group>
)}


              {/* الكمية */}
              <Form.Group className="mb-3">
                <Form.Label>الكمية</Form.Label>
                <Form.Control
                  type="number"
                  value={editingItem.quantity}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, quantity: e.target.value })
                  }
                />
              </Form.Group>

              {/* الموظف */}
              {editingItem.need === "متوفر" && (
                <Form.Group className="mb-3">
                  <Form.Label>الموظف</Form.Label>
                  <Select
                    options={employees}
                    value={{ label: editingItem.employee, value: editingItem.employee }}
                    onChange={(selected) =>
                      setEditingItem({ ...editingItem, employee: selected.value })
                    }
                  />
                </Form.Group>
              )}

        

              {/* الحالة */}
              {editingItem.need === "متوفر" && (
                <Form.Group className="mb-3">
                  <Form.Label>الحالة</Form.Label>
                  <Form.Select
                    value={editingItem.status}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, status: e.target.value })
                    }
                  >
                    <option value="جيد جدا">جيد جدا</option>
                    <option value="جيد">جيد</option>
                    <option value="بحاجة صيانة">بحاجة صيانة</option>
                  </Form.Select>
                </Form.Group>
              )}

              {/* المشكلة */}
              {editingItem.status === "بحاجة صيانة" && (
                <Form.Group className="mb-3">
                  <Form.Label>المشكلة</Form.Label>
                  <Form.Control
                    value={editingItem.problem || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, problem: e.target.value })
                    }
                  />
                </Form.Group>
              )}

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
