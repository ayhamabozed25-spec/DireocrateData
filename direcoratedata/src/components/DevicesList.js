import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button, Table, Modal, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useAuth } from "../components/AuthContext"; // استدعاء السياق

export default function DevicesList() {
  const [devices, setDevices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);

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

  // تحميل الأجهزة حسب الدور
  const loadDevices = async () => {
    if (!currentUser) return;

    let q;
    if (currentUser.role === "institutionManager") {
      q = query(collection(db, "devices"), where("institutionName", "==", currentUser.name));
    } else if (currentUser.role === "departementManager") {
      q = query(collection(db, "devices"), where("departmentName", "==", currentUser.departmentName));
    } else if (currentUser.role === "divisionManager") {
      q = query(collection(db, "devices"), where("divisionName", "==", currentUser.divisionName));
    } else {
      q = collection(db, "devices"); // مدير النظام يرى الجميع
    }

    const snapshot = await getDocs(q);
    setDevices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    loadDevices();
  }, [currentUser]);

  const handleEdit = (dev) => {
    setEditingDevice({ ...dev });
    setShowModal(true);
  };

  const handleSaveEdit = async () => {
    const ref = doc(db, "devices", editingDevice.id);
    await updateDoc(ref, {
      ...editingDevice,
      managerEmail: currentUser?.email || null, // تحديث البريد الحالي عند التعديل
    });
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
      <Form onSubmit={handleSaveEdit}>

        {/* الحاجة */}
        <Form.Group>
          <Form.Label>الحاجة</Form.Label>
          <Form.Select
            value={editingDevice.need}
            onChange={(e) => setEditingDevice({ ...editingDevice, need: e.target.value })}
            required
          >
            <option value="">اختر</option>
            <option value="مطلوب">مطلوب</option>
            <option value="متوفر">متوفر</option>
          </Form.Select>
        </Form.Group>

        {/* نوع الجهاز */}
        <Form.Group>
          <Form.Label>نوع الجهاز</Form.Label>
          <Form.Select
            value={editingDevice.type}
            onChange={(e) => setEditingDevice({ ...editingDevice, type: e.target.value })}
            required
          >
            <option value="">اختر</option>
            <option value="لاب توب">لاب توب</option>
            <option value="سيرفر">سيرفر</option>
            <option value="حاسوب مكتبي">حاسوب مكتبي</option>
            <option value="تاب">تاب</option>
            <option value="طابعة">طابعة</option>
            <option value="راوتر">راوتر</option>
            <option value="أخرى">أخرى</option>
          </Form.Select>
        </Form.Group>

        {editingDevice.type === "أخرى" && (
          <Form.Group>
            <Form.Label>نوع آخر</Form.Label>
            <Form.Control
              value={editingDevice.otherType || ""}
              onChange={(e) => setEditingDevice({ ...editingDevice, otherType: e.target.value })}
              required
            />
          </Form.Group>
        )}

        {/* المعالج */}
        {(["لاب توب", "سيرفر", "حاسوب مكتبي"].includes(editingDevice.type)) && (
          <>
            <Form.Group>
              <Form.Label>المعالج</Form.Label>
              <Form.Select
                value={editingDevice.processor}
                onChange={(e) => setEditingDevice({ ...editingDevice, processor: e.target.value })}
                required
              >
                <option value="">اختر</option>
                <option value="Intel i3">Intel i3</option>
                <option value="Intel i5">Intel i5</option>
                <option value="Intel i7">Intel i7</option>
                <option value="Intel i9">Intel i9</option>
                <option value="AMD Ryzen 3">AMD Ryzen 3</option>
                <option value="AMD Ryzen 5">AMD Ryzen 5</option>
                <option value="AMD Ryzen 7">AMD Ryzen 7</option>
                <option value="AMD Ryzen 9">AMD Ryzen 9</option>
                <option value="أخرى">أخرى</option>
              </Form.Select>
            </Form.Group>

            {editingDevice.processor === "أخرى" && (
              <Form.Group>
                <Form.Label>معالج آخر</Form.Label>
                <Form.Control
                  value={editingDevice.otherProcessor || ""}
                  onChange={(e) => setEditingDevice({ ...editingDevice, otherProcessor: e.target.value })}
                  required
                />
              </Form.Group>
            )}
          </>
        )}

        {/* RAM */}
        {(["لاب توب", "سيرفر", "تاب", "حاسوب مكتبي"].includes(editingDevice.type)) && (
          <Form.Group>
            <Form.Label>الذاكرة RAM</Form.Label>
            <Form.Select
              value={editingDevice.ram}
              onChange={(e) => setEditingDevice({ ...editingDevice, ram: e.target.value })}
              required
            >
              <option value="">اختر</option>
              <option value="2">2 GB</option>
              <option value="4">4 GB</option>
              <option value="8">8 GB</option>
              <option value="16">16 GB</option>
              <option value="32">32 GB</option>
            </Form.Select>
          </Form.Group>
        )}

        {/* الوصف */}
        <Form.Group>
          <Form.Label>الوصف</Form.Label>
          <Form.Control
            value={editingDevice.description}
            onChange={(e) => setEditingDevice({ ...editingDevice, description: e.target.value })}
            required
          />
        </Form.Group>

        {/* ملاحظات */}
        <Form.Group>
          <Form.Label>ملاحظات</Form.Label>
          <Form.Control
            value={editingDevice.notes || ""}
            onChange={(e) => setEditingDevice({ ...editingDevice, notes: e.target.value })}
          />
        </Form.Group>

        {/* الحقول التي تظهر فقط عند اختيار متوفر */}
        {editingDevice.need === "متوفر" && (
          <>
            {/* البراند */}
            <Form.Group>
              <Form.Label>البراند</Form.Label>
              <Form.Select
                value={editingDevice.brand}
                onChange={(e) => setEditingDevice({ ...editingDevice, brand: e.target.value })}
                required
              >
                <option value="">اختر</option>
                {brandOptions[editingDevice.type]?.map((b, i) => (
                  <option key={i} value={b}>{b}</option>
                ))}
                <option value="أخرى">أخرى</option>
              </Form.Select>
            </Form.Group>

            {editingDevice.brand === "أخرى" && (
              <Form.Group>
                <Form.Label>براند آخر</Form.Label>
                <Form.Control
                  value={editingDevice.otherBrand || ""}
                  onChange={(e) => setEditingDevice({ ...editingDevice, otherBrand: e.target.value })}
                  required
                />
              </Form.Group>
            )}

            {/* تاريخ الشراء */}
            <Form.Group>
              <Form.Label>تاريخ الشراء</Form.Label>
              <Form.Control
                type="date"
                value={editingDevice.purchaseDate || ""}
                onChange={(e) => setEditingDevice({ ...editingDevice, purchaseDate: e.target.value })}
                required
              />
            </Form.Group>

            {/* الموظف المستلم */}
            <Form.Group>
              <Form.Label>الموظف المستلم</Form.Label>
              <Select
                options={employees}
                value={editingDevice.employee ? { label: editingDevice.employee, value: editingDevice.employee } : null}
                onChange={(selected) => setEditingDevice({ ...editingDevice, employee: selected.value })}
                placeholder="اختر الموظف"
                isSearchable
                required
              />
            </Form.Group>

            {/* الحالة */}
            <Form.Group>
              <Form.Label>الحالة</Form.Label>
              <Form.Select
                value={editingDevice.status}
                onChange={(e) => setEditingDevice({ ...editingDevice, status: e.target.value })}
                required
              >
                <option value="">اختر</option>
                <option value="يعمل بشكل جيد">يعمل بشكل جيد</option>
                <option value="يعمل بأداء ضعيف">يعمل بأداء ضعيف</option>
                <option value="معطل">معطل</option>
              </Form.Select>
            </Form.Group>

            {/* وصف العطل + أولوية الإصلاح */}
            {editingDevice.status === "معطل" && (
              <>
                <Form.Group>
                  <Form.Label>وصف العطل</Form.Label>
                  <Form.Control
                    value={editingDevice.breakdown || ""}
                    onChange={(e) => setEditingDevice({ ...editingDevice, breakdown: e.target.value })}
                    required
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>أولوية الإصلاح (1-5)</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max="5"
                    value={editingDevice.priority || ""}
                    onChange={(e) => setEditingDevice({ ...editingDevice, priority: e.target.value })}
                    required
                  />
                </Form.Group>
              </>
            )}

            {/* التأثير */}
            {(editingDevice.status === "معطل" || editingDevice.status === "يعمل بأداء ضعيف") && (
              <Form.Group>
                <Form.Label>التأثير على الخدمة (%)</Form.Label>
                <Form.Control
                  type="number"
                  value={editingDevice.effect || ""}
                  onChange={(e) => setEditingDevice({ ...editingDevice, effect: e.target.value })}
                  required
                />
              </Form.Group>
            )}

            {/* الكلفة + العملة */}
  
        <Row className="mt-3">
          <Col md={8}>
            <Form.Label>الكلفة *</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={editingDevice.cost || ""}
              onChange={(e) =>
                setEditingDevice({ ...editingDevice, cost: e.target.value })
              }
              required
            />
          </Col>
          <Col md={4}>
            <Form.Label>العملة</Form.Label>
            <Form.Select
              value={editingDevice.currency || "USD"}
              onChange={(e) =>
                setEditingDevice({ ...editingDevice, currency: e.target.value })
              }
            >
              <option value="USD">دولار</option>
              <option value="SYP">ليرة سورية</option>
            </Form.Select>
          </Col>
        </Row>
      </>
    )}

    <Button type="submit" className="mt-3">
      حفظ التعديلات
    </Button>
  </Form>
)}
</Modal.Body>

<Modal.Footer>
  <Button variant="secondary" onClick={() => setShowModal(false)}>
    إلغاء
  </Button>
</Modal.Footer>
</Modal>
   </div>
  );
}
