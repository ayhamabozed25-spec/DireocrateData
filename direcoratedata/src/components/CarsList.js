import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button, Table, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

export default function CarsList() {
  const [cars, setCars] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);

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

  // تحميل الآليات
  const loadCars = async () => {
    const snapshot = await getDocs(collection(db, "cars"));
    setCars(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    loadCars();
  }, []);

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

  const carNamesOptions = {
    "سيارة خدمة": ["سبورتاج", "توسان", "كيا ريو", "هيونداي النترا", "أخرى"],
    "مركبة زراعية": ["جرار", "كومباين", "أخرى"],
    "سيارة إسعاف": ["مرسيدس سبرينتر", "فورد ترانزيت", "أخرى"],
    "شاحنة": ["فولفو FH", "مرسيدس أكتروس", "أخرى"],
    "باص": ["هيونداي كاونتي", "مرسيدس ميني باص", "أخرى"],
    "أخرى": ["أخرى"]
  };

  return (
    <div className="p-3">
      <h3>الآليات</h3>

      {/* زر إضافة */}
      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" onClick={() => navigate("/add-car")}>
          إضافة آلية جديدة
        </Button>
      </div>

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
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {filteredCars.map((car) => (
            <tr key={car.id}>
              <td>{car.type}</td>
              <td>{car.name}</td>
              <td>{car.employee}</td>
              <td>{car.status}</td>
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
                >
                  <option value="متوفر">متوفر</option>
                  <option value="مطلوب">مطلوب</option>
                </Form.Select>
              </Form.Group>

              {/* النوع */}
              <Form.Group className="mb-3">
                <Form.Label>نوع الآلية</Form.Label>
                <Form.Control
                  value={editingCar.type}
                  onChange={(e) =>
                    setEditingCar({ ...editingCar, type: e.target.value })
                  }
                />
              </Form.Group>

              {/* الاسم */}
              <Form.Group className="mb-3">
                <Form.Label>اسم الآلية</Form.Label>
                <Form.Control
                  value={editingCar.name}
                  onChange={(e) =>
                    setEditingCar({ ...editingCar, name: e.target.value })
                  }
                />
              </Form.Group>

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
                  />
                </Form.Group>
              )}

              {/* الموظف */}
              {editingCar.need === "متوفر" && (
                <Form.Group className="mb-3">
                  <Form.Label>الموظف</Form.Label>
                  <Select
                    options={employees}
                    value={{ label: editingCar.employee, value: editingCar.employee }}
                    onChange={(selected) =>
                      setEditingCar({ ...editingCar, employee: selected.value })
                    }
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
                  >
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
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>التأثير على الخدمة</Form.Label>
                    <Form.Control
                      value={editingCar.effect || ""}
                      onChange={(e) =>
                        setEditingCar({ ...editingCar, effect: e.target.value })
                      }
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
