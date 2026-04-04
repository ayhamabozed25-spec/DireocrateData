import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button, Table, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useAuth } from "../components/AuthContext";

export default function CarsList() {
  const [cars, setCars] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);

  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // تحميل الموظفين (يمكنك لاحقًا فلترتهم بنفس منطق الصلاحيات)
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

    const carNamesOptions = {
    "سيارة خدمة": ["سبورتاج", "توسان", "كيا ريو", "هيونداي النترا", "أخرى"],
    "مركبة زراعية": ["جرار", "كومباين", "أخرى"],
    "سيارة إسعاف": ["مرسيدس سبرينتر", "فورد ترانزيت", "أخرى"],
    "شاحنة": ["فولفو FH", "مرسيدس أكتروس", "أخرى"],
    "باص": ["هيونداي كاونتي", "مرسيدس ميني باص", "أخرى"],
    "أخرى": ["أخرى"]
  };
  
  // تحميل الآليات حسب الدور
  const loadCars = async () => {
    if (!currentUser) return;

    let q;
    if (currentUser.role === "institutionManager") {
      q = query(collection(db, "cars"), where("institutionName", "==", currentUser.name));
    } else if (currentUser.role === "departementManager") {
      q = query(collection(db, "cars"), where("departmentName", "==", currentUser.departmentName));
    } else if (currentUser.role === "divisionManager") {
      q = query(collection(db, "cars"), where("divisionName", "==", currentUser.divisionName));
    } else {
      // مدير النظام يرى الجميع
      q = collection(db, "cars");
    }

    const snapshot = await getDocs(q);
    setCars(snapshot.docs.map(docu => ({ id: docu.id, ...docu.data() })));
  };

  useEffect(() => {
    loadCars();
  }, [currentUser]);

  const handleEdit = (car) => {
    setEditingCar({ ...car });
    setShowModal(true);
  };

  const handleSaveEdit = async () => {
    const ref = doc(db, "cars", editingCar.id);
    await updateDoc(ref, editingCar);
    setShowModal(false);
    loadCars();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل تريد حذف هذه الآلية؟")) return;
    await deleteDoc(doc(db, "cars", id));
    loadCars();
  };

  const filteredCars = cars.filter(car =>
    car.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-3">
      <h3>الآليات</h3>

      {/* زر إضافة يظهر فقط لغير مدير النظام */}
      {currentUser?.role !== "systemAdmin" && (
        <div className="d-flex justify-content-end mb-3">
          <Button variant="primary" onClick={() => navigate("/add-car")}>
            إضافة آلية جديدة
          </Button>
        </div>
      )}

      {/* البحث */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-bold">بحث</Form.Label>
        <Form.Control
          type="text"
          placeholder="ابحث عن آلية..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      {/* جدول الآليات */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>النوع</th>
            <th>الاسم</th>
            <th>الموظف</th>
            <th>الحالة</th>
            {/* عمود الإجراءات يظهر فقط لغير مدير النظام */}
            {currentUser?.role !== "systemAdmin" && <th>إجراءات</th>}
          </tr>
        </thead>
        <tbody>
          {filteredCars.map((car) => (
            <tr key={car.id}>
              <td>{car.type}</td>
              <td>{car.name}</td>
              <td>{car.employee}</td>
              <td>{car.status}</td>
              {currentUser?.role !== "systemAdmin" && (
                <td>
                  <Button
                    size="sm"
                    variant="warning"
                    className="me-2"
                    onClick={() => handleEdit(car)}
                  >
                    تعديل
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(car.id)}
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
    <Modal.Title>تعديل الآلية</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    {editingCar && (
      <Form>
        {/* الحاجة */}
        <Form.Group className="mb-3">
          <Form.Label>الحاجة</Form.Label>
          <Form.Select
            value={editingCar.need}
            onChange={(e) =>
              setEditingCar({ ...editingCar, need: e.target.value })
            }
            required
          >
            <option value="">اختر</option>
            <option value="متوفر">متوفر</option>
            <option value="مطلوب">مطلوب</option>
          </Form.Select>
        </Form.Group>

        {/* نوع الآلية */}
        <Form.Group className="mb-3">
          <Form.Label>نوع الآلية</Form.Label>
          <Form.Select
            value={editingCar.type}
            onChange={(e) =>
              setEditingCar({ ...editingCar, type: e.target.value })
            }
            required
          >
            <option value="">اختر</option>
            <option value="سيارة خدمة">سيارة خدمة</option>
            <option value="مركبة زراعية">مركبة زراعية</option>
            <option value="سيارة إسعاف">سيارة إسعاف</option>
            <option value="شاحنة">شاحنة</option>
            <option value="باص">باص</option>
            <option value="أخرى">أخرى</option>
          </Form.Select>
        </Form.Group>

        {editingCar.type === "أخرى" && (
          <Form.Group className="mb-3">
            <Form.Label>نوع آخر</Form.Label>
            <Form.Control
              value={editingCar.otherType || ""}
              onChange={(e) =>
                setEditingCar({ ...editingCar, otherType: e.target.value })
              }
              required
            />
          </Form.Group>
        )}

        {/* اسم الآلية */}
        {editingCar.type && (
          <Form.Group className="mb-3">
            <Form.Label>اسم الآلية</Form.Label>
            <Form.Select
              value={editingCar.name}
              onChange={(e) =>
                setEditingCar({ ...editingCar, name: e.target.value })
              }
              required
            >
              <option value="">اختر</option>
              {carNamesOptions[editingCar.type]?.map((n, i) => (
                <option key={i} value={n}>{n}</option>
              ))}
            </Form.Select>
          </Form.Group>
        )}

        {editingCar.name === "أخرى" && (
          <Form.Group className="mb-3">
            <Form.Label>اسم آخر</Form.Label>
            <Form.Control
              value={editingCar.otherName || ""}
              onChange={(e) =>
                setEditingCar({ ...editingCar, otherName: e.target.value })
              }
              required
            />
          </Form.Group>
        )}

        {/* سنة التصنيع */}
        {editingCar.need === "متوفر" && (
          <Form.Group className="mb-3">
            <Form.Label>سنة التصنيع</Form.Label>
            <Form.Control
              type="number"
              value={editingCar.year || ""}
              onChange={(e) =>
                setEditingCar({ ...editingCar, year: e.target.value })
              }
              required
            />
          </Form.Group>
        )}

        {/* الموظف */}
        {editingCar.need === "متوفر" && (
          <Form.Group className="mb-3">
            <Form.Label>الموظف</Form.Label>
            <Select
              options={employees}
              value={
                editingCar.employee
                  ? { label: editingCar.employee, value: editingCar.employee }
                  : null
              }
              onChange={(selected) =>
                setEditingCar({ ...editingCar, employee: selected.value })
              }
              placeholder="اختر الموظف"
              isSearchable
              required
            />
          </Form.Group>
        )}

        {/* الحالة */}
        {editingCar.need === "متوفر" && (
          <Form.Group className="mb-3">
            <Form.Label>الحالة</Form.Label>
            <Form.Select
              value={editingCar.status}
              onChange={(e) =>
                setEditingCar({ ...editingCar, status: e.target.value })
              }
              required
            >
              <option value="">اختر</option>
              <option value="في الخدمة">في الخدمة</option>
              <option value="معطلة">معطلة</option>
            </Form.Select>
          </Form.Group>
        )}

        {/* الأعطال */}
        {editingCar.status === "معطلة" && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>سبب العطل</Form.Label>
              <Form.Control
                value={editingCar.breakdown || ""}
                onChange={(e) =>
                  setEditingCar({ ...editingCar, breakdown: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>التأثير على الخدمة</Form.Label>
              <Form.Control
                value={editingCar.effect || ""}
                onChange={(e) =>
                  setEditingCar({ ...editingCar, effect: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>أولوية الإصلاح (1-5)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="5"
                value={editingCar.priority || ""}
                onChange={(e) =>
                  setEditingCar({ ...editingCar, priority: e.target.value })
                }
                required
              />
            </Form.Group>
          </>
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
