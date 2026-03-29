import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button, Table, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

export default function DevicesList() {
  const [devices, setDevices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);

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

  // تحميل الأجهزة
  const loadDevices = async () => {
    const snapshot = await getDocs(collection(db, "devices"));
    setDevices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    loadDevices();
  }, []);

  const handleEdit = (dev) => {
    setEditingDevice({ ...dev });
    setShowModal(true);
  };

  const handleSaveEdit = async () => {
    const ref = doc(db, "devices", editingDevice.id);
    await updateDoc(ref, editingDevice);
    setShowModal(false);
    loadDevices();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل تريد حذف هذا الجهاز؟")) return;
    await deleteDoc(doc(db, "devices", id));
    loadDevices();
  };

  const filteredDevices = devices.filter(dev =>
    dev.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dev.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dev.model?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const brandOptions = {
    "لاب توب": ["Dell", "HP", "Lenovo", "Asus", "Acer", "Apple", "أخرى"],
    "سيرفر": ["Dell", "HP", "IBM", "Cisco", "Supermicro", "أخرى"],
    "حاسوب مكتبي": ["Dell", "HP", "Lenovo", "Asus", "MSI", "أخرى"],
    "تاب": ["Samsung", "Apple", "Huawei", "Lenovo", "أخرى"],
    "طابعة": ["Canon", "HP", "Epson", "Brother", "أخرى"],
    "راوتر": ["Cisco", "TP-Link", "Netgear", "Huawei", "أخرى"],
    "أخرى": ["أخرى"]
  };

  return (
    <div className="p-3">
      <h3>الأجهزة</h3>

      {/* زر إضافة */}
      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" onClick={() => navigate("/add-device")}>
          إضافة جهاز جديد
        </Button>
      </div>

      {/* البحث */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-bold">بحث</Form.Label>
        <Form.Control
          type="text"
          placeholder="ابحث عن جهاز..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      {/* جدول الأجهزة */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>الحاجة</th>
            <th>النوع</th>
            <th>البراند</th>
            <th>الموديل</th>
            <th>الموظف</th>
            <th>الحالة</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {filteredDevices.map((dev) => (
            <tr key={dev.id}>
              <td>{dev.need}</td>
              <td>{dev.type}</td>
              <td>{dev.brand}</td>
              <td>{dev.model}</td>
              <td>{dev.employee}</td>
              <td>{dev.status}</td>
              <td>
                <Button
                  size="sm"
                  variant="warning"
                  className="me-2"
                  onClick={() => handleEdit(dev)}
                >
                  تعديل
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(dev.id)}
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
          <Modal.Title>تعديل الجهاز</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {editingDevice && (
            <Form>

              {/* الحاجة */}
              <Form.Group className="mb-3">
                <Form.Label>الحاجة</Form.Label>
                <Form.Select
                  value={editingDevice.need}
                  onChange={(e) =>
                    setEditingDevice({ ...editingDevice, need: e.target.value })
                  }
                >
                  <option value="مطلوب">مطلوب</option>
                  <option value="متوفر">متوفر</option>
                </Form.Select>
              </Form.Group>

              {/* نوع الجهاز */}
              <Form.Group className="mb-3">
                <Form.Label>نوع الجهاز</Form.Label>
                <Form.Control
                  value={editingDevice.type}
                  onChange={(e) =>
                    setEditingDevice({ ...editingDevice, type: e.target.value })
                  }
                />
              </Form.Group>

              {/* البراند */}
              <Form.Group className="mb-3">
                <Form.Label>البراند</Form.Label>
                <Form.Control
                  value={editingDevice.brand}
                  onChange={(e) =>
                    setEditingDevice({ ...editingDevice, brand: e.target.value })
                  }
                />
              </Form.Group>

              {/* الموديل */}
              <Form.Group className="mb-3">
                <Form.Label>الموديل</Form.Label>
                <Form.Control
                  value={editingDevice.model}
                  onChange={(e) =>
                    setEditingDevice({ ...editingDevice, model: e.target.value })
                  }
                />
              </Form.Group>

              {/* المعالج */}
              <Form.Group className="mb-3">
                <Form.Label>المعالج</Form.Label>
                <Form.Control
                  value={editingDevice.processor}
                  onChange={(e) =>
                    setEditingDevice({ ...editingDevice, processor: e.target.value })
                  }
                />
              </Form.Group>

              {/* الذاكرة */}
              <Form.Group className="mb-3">
                <Form.Label>RAM</Form.Label>
                <Form.Control
                  value={editingDevice.ram}
                  onChange={(e) =>
                    setEditingDevice({ ...editingDevice, ram: e.target.value })
                  }
                />
              </Form.Group>

              {/* الموظف */}
              {editingDevice.need === "متوفر" && (
                <Form.Group className="mb-3">
                  <Form.Label>الموظف</Form.Label>
                  <Select
                    options={employees}
                    value={{ label: editingDevice.employee, value: editingDevice.employee }}
                    onChange={(selected) =>
                      setEditingDevice({ ...editingDevice, employee: selected.value })
                    }
                  />
                </Form.Group>
              )}

              {/* تاريخ الشراء */}
              {editingDevice.need === "متوفر" && (
                <Form.Group className="mb-3">
                  <Form.Label>تاريخ الشراء</Form.Label>
                  <Form.Control
                    type="date"
                    value={editingDevice.purchaseDate || ""}
                    onChange={(e) =>
                      setEditingDevice({ ...editingDevice, purchaseDate: e.target.value })
                    }
                  />
                </Form.Group>
              )}

              {/* الكلفة */}
              <Form.Group className="mb-3">
                <Form.Label>الكلفة</Form.Label>
                <Form.Control
                  type="number"
                  value={editingDevice.cost}
                  onChange={(e) =>
                    setEditingDevice({ ...editingDevice, cost: e.target.value })
                  }
                />
              </Form.Group>

              {/* الحالة */}
              {editingDevice.need === "متوفر" && (
                <Form.Group className="mb-3">
                  <Form.Label>الحالة</Form.Label>
                  <Form.Select
                    value={editingDevice.status}
                    onChange={(e) =>
                      setEditingDevice({ ...editingDevice, status: e.target.value })
                    }
                  >
                    <option value="يعمل بشكل جيد">يعمل بشكل جيد</option>
                    <option value="يعمل بأداء ضعيف">يعمل بأداء ضعيف</option>
                    <option value="معطل">معطل</option>
                  </Form.Select>
                </Form.Group>
              )}

              {/* وصف العطل */}
              {editingDevice.status === "معطل" && (
                <Form.Group className="mb-3">
                  <Form.Label>وصف العطل</Form.Label>
                  <Form.Control
                    value={editingDevice.breakdown || ""}
                    onChange={(e) =>
                      setEditingDevice({ ...editingDevice, breakdown: e.target.value })
                    }
                  />
                </Form.Group>
              )}

              {/* التأثير */}
              {(editingDevice.status === "معطل" ||
                editingDevice.status === "يعمل بأداء ضعيف") && (
                <Form.Group className="mb-3">
                  <Form.Label>التأثير على الخدمة (%)</Form.Label>
                  <Form.Control
                    type="number"
                    value={editingDevice.effect || ""}
                    onChange={(e) =>
                      setEditingDevice({ ...editingDevice, effect: e.target.value })
                    }
                  />
                </Form.Group>
              )}

              {/* أولوية الإصلاح */}
              {editingDevice.status === "معطل" && (
                <Form.Group className="mb-3">
                  <Form.Label>أولوية الإصلاح (1-5)</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max="5"
                    value={editingDevice.priority || ""}
                    onChange={(e) =>
                      setEditingDevice({ ...editingDevice, priority: e.target.value })
                    }
                  />
                </Form.Group>
              )}

              {/* الوصف */}
              <Form.Group className="mb-3">
                <Form.Label>الوصف</Form.Label>
                <Form.Control
                  value={editingDevice.description}
                  onChange={(e) =>
                    setEditingDevice({ ...editingDevice, description: e.target.value })
                  }
                />
              </Form.Group>

              {/* ملاحظات */}
              <Form.Group className="mb-3">
                <Form.Label>ملاحظات</Form.Label>
                <Form.Control
                  value={editingDevice.notes || ""}
                  onChange={(e) =>
                    setEditingDevice({ ...editingDevice, notes: e.target.value })
                  }
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
