import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button, Table, Modal, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";


 

export default function BuildingList() {
  const [buildings, setBuildings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState(null);
  const [mapPosition, setMapPosition] = useState([35.523, 35.791]);
  const [searchQuery, setSearchQuery] = useState("");

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
    setMapPosition(building.mapPosition || [35.523, 35.791]);
    setShowModal(true);
  };

  const handleSaveEdit = async () => {
    const ref = doc(db, "buildings", editingBuilding.id);
    await updateDoc(ref, { ...editingBuilding, mapPosition });
    setShowModal(false);
    loadBuildings();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل تريد حذف هذا البناء؟")) return;
    await deleteDoc(doc(db, "buildings", id));
    loadBuildings();
  };

  const handleSearch = async () => {
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query: searchQuery });
    if (results && results.length > 0) {
      const { x, y } = results[0];
      setMapPosition([y, x]);
    }
  };

  const filteredBuildings = buildings.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-3">
      <h3>الأبنية</h3>

      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" onClick={() => navigate("/add-building")}>
          إضافة بناء جديد
        </Button>
      </div>

      <Form.Group className="mb-3">
        <Form.Label className="fw-bold">بحث</Form.Label>
        <Form.Control
          type="text"
          placeholder="ابحث عن اسم بناء..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

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

              <Form.Group className="mb-3">
          <Form.Label>ابحث عن الموقع</Form.Label>
          <Row>
            <Col md={9}>
              <Form.Control
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="أدخل اسم شارع أو مدينة..."
              />
            </Col>
            <Col md={3}>
              <Button variant="primary" onClick={handleSearch}>
                بحث
              </Button>
            </Col>
          </Row>
        </Form.Group>

        {/* 🔥 استبدال الخريطة القديمة بـ MapPicker */}
        <Form.Group className="mb-3">
          <Form.Label>الخريطة</Form.Label>

          <MapPicker
            onSelect={(coords) => {
              if (coords) {
                setMapPosition([coords.lat, coords.lng]);
              }
            }}
          />

          {mapPosition && (
            <div className="mt-2 text-success">
              الموقع الحالي: {mapPosition[0].toFixed(5)}, {mapPosition[1].toFixed(5)}
            </div>
          )}
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

              {/* الكلفة */}
              {editingBuilding.ownership !== "بناء حكومي" && (
                <Form.Group className="mb-3">
                  <Form.Label>الكلفة</Form.Label>
                  <Row>
                    <Col md={8}>
                      <Form.Control
                        type="number"
                        value={editingBuilding.cost || ""}
                        onChange={(e) =>
                          setEditingBuilding({ ...editingBuilding, cost: e.target.value })
                        }
                      />
                    </Col>
                    <Col md={4}>
                      <Form.Select
                        value={editingBuilding.currency || "دولار"}
                        onChange={(e) =>
                          setEditingBuilding({ ...editingBuilding, currency: e.target.value })
                        }
                      >
                        <option value="دولار">دولار</option>
                        <option value="ليرة سورية">ليرة سورية</option>
                      </Form.Select>
                    </Col>
                  </Row>
                </Form.Group>
              )}

              {/* الطوابق */}
              <Form.Group className="mb-3">
                <Form.Label>عدد الطوابق</Form.Label>
                <Form.Control
                  type="number"
                  value={editingBuilding.floors || ""}
                  onChange={(e) =>
                    setEditingBuilding({ ...editingBuilding, floors: e.target.value })
                  }
                />
              </Form.Group>

                           {/* المكاتب */}
              <Form.Group className="mb-3">
                <Form.Label>عدد المكاتب</Form.Label>
                <Form.Control
                  type="number"
                  value={editingBuilding.offices || ""}
                  onChange={(e) =>
                    setEditingBuilding({ ...editingBuilding, offices: e.target.value })
                  }
                />
              </Form.Group>

              {/* السعة */}
              <Form.Group className="mb-3">
                <Form.Label>السعة</Form.Label>
                <Form.Control
                  type="number"
                  value={editingBuilding.capacity || ""}
                  onChange={(e) =>
                    setEditingBuilding({ ...editingBuilding, capacity: e.target.value })
                  }
                />
              </Form.Group>

              {/* المساحة */}
              <Form.Group className="mb-3">
                <Form.Label>المساحة</Form.Label>
                <Form.Control
                  type="number"
                  value={editingBuilding.area || ""}
                  onChange={(e) =>
                    setEditingBuilding({ ...editingBuilding, area: e.target.value })
                  }
                />
              </Form.Group>

              {/* تاريخ البناء */}
              <Form.Group className="mb-3">
                <Form.Label>تاريخ البناء</Form.Label>
                <Form.Control
                  type="date"
                  value={editingBuilding.buildingDate || ""}
                  onChange={(e) =>
                    setEditingBuilding({ ...editingBuilding, buildingDate: e.target.value })
                  }
                />
              </Form.Group>

              {/* الحالة الإنشائية */}
              <Form.Group className="mb-3">
                <Form.Label>الحالة الإنشائية</Form.Label>
                <Form.Select
                  value={editingBuilding.structuralCondition || ""}
                  onChange={(e) =>
                    setEditingBuilding({
                      ...editingBuilding,
                      structuralCondition: e.target.value,
                    })
                  }
                >
                  <option value="جيد جدا">جيد جدا</option>
                  <option value="مرمم حديثا">مرمم حديثا</option>
                  <option value="بحاجة ترميم جزئي">بحاجة ترميم جزئي</option>
                  <option value="بحاجة ترميم كلي">بحاجة ترميم كلي</option>
                </Form.Select>
              </Form.Group>

              {/* مستوى الخطورة */}
              {(editingBuilding.structuralCondition === "بحاجة ترميم جزئي" ||
                editingBuilding.structuralCondition === "بحاجة ترميم كلي") && (
                <Form.Group className="mb-3">
                  <Form.Label>مستوى الخطورة (%)</Form.Label>
                  <Form.Control
                    type="number"
                    value={editingBuilding.riskLevel || ""}
                    onChange={(e) =>
                      setEditingBuilding({
                        ...editingBuilding,
                        riskLevel: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              )}

              {/* تاريخ الترميم */}
              {editingBuilding.structuralCondition !== "جيد جدا" && (
                <Form.Group className="mb-3">
                  <Form.Label>تاريخ الترميم</Form.Label>
                  <Form.Control
                    type="date"
                    value={editingBuilding.restorationDate || ""}
                    onChange={(e) =>
                      setEditingBuilding({
                        ...editingBuilding,
                        restorationDate: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              )}

              {/* تفاصيل الترميم */}
              {editingBuilding.structuralCondition === "مرمم حديثا" && (
                <Form.Group className="mb-3">
                  <Form.Label>تفاصيل الترميم</Form.Label>
                  <Form.Control
                    value={editingBuilding.restorationDetails || ""}
                    onChange={(e) =>
                      setEditingBuilding({
                        ...editingBuilding,
                        restorationDetails: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              )}

              {/* نظام إنذار الحريق */}
              <Form.Group className="mb-3">
                <Form.Label>نظام إنذار الحريق</Form.Label>
                <Form.Select
                  value={editingBuilding.fireAlarmSystem || ""}
                  onChange={(e) =>
                    setEditingBuilding({
                      ...editingBuilding,
                      fireAlarmSystem: e.target.value,
                    })
                  }
                >
                  <option value="نعم">نعم</option>
                  <option value="لا">لا</option>
                </Form.Select>
              </Form.Group>

              {/* نظام البصمة */}
              <Form.Group className="mb-3">
                <Form.Label>نظام البصمة</Form.Label>
                <Form.Select
                  value={editingBuilding.fingerprintSystem || ""}
                  onChange={(e) =>
                    setEditingBuilding({
                      ...editingBuilding,
                      fingerprintSystem: e.target.value,
                    })
                  }
                >
                  <option value="نعم">نعم</option>
                  <option value="لا">لا</option>
                </Form.Select>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            إلغاء
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setEditingBuilding({ ...editingBuilding, mapPosition });
              handleSaveEdit();
            }}
          >
            حفظ التعديلات
          </Button>
        </Modal.Footer>
      </Modal>

  </div>
  );
}
