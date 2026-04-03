import { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Table, Button, Form, Card, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext"; // استدعاء السياق

export default function EmployeesList() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // تحميل الموظفين حسب الدور
  const loadEmployees = async () => {
    if (!currentUser) return;

    let q;
    if (currentUser.role === "institutionManager") {
      q = query(collection(db, "employees"), where("institutionName", "==", currentUser.name));
    } else if (currentUser.role === "departementManager") {
      q = query(collection(db, "employees"), where("department", "==", currentUser.departmentName));
    } else if (currentUser.role === "divisionManager") {
      q = query(collection(db, "employees"), where("division", "==", currentUser.divisionName));
    } else {
      q = collection(db, "employees"); // مدير النظام يرى الجميع لكن بدون أزرار
    }

    const snapshot = await getDocs(q);
    setEmployees(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    loadEmployees();
  }, [currentUser]);

  const handleDelete = async (id) => {
    if (!window.confirm("هل تريد حذف هذا الموظف؟")) return;
    await deleteDoc(doc(db, "employees", id));
    loadEmployees();
  };

  const filteredEmployees = employees.filter(emp =>
    (emp.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-3">
      <h3>الموظفون</h3>

      {/* زر إضافة يظهر فقط لغير مدير النظام */}
      {currentUser?.role !== "systemAdmin" && (
        <div className="d-flex justify-content-end mb-3">
          <Button onClick={() => navigate("/add-employee")}>إضافة موظف جديد</Button>
        </div>
      )}

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>🔍 البحث عن موظف</Card.Title>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="أدخل اسم الموظف"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="primary">بحث</Button>
          </InputGroup>
        </Card.Body>
      </Card>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>الاسم</th>
            <th>الحاجة</th>
            <th>المؤسسة</th>
            <th>القسم</th>
            <th>الشعبة</th>
            <th>المسمى الوظيفي</th>
            {/* عمود الإجراءات يظهر فقط لغير مدير النظام */}
            {currentUser?.role !== "systemAdmin" && <th>إجراءات</th>}
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map(emp => (
            <tr key={emp.id}>
              <td>{emp.name || "شاغر"}</td>
              <td>{emp.need}</td>
              <td>{emp.institutionName || "بدون"}</td>
              <td>{emp.department || "بدون"}</td>
              <td>{emp.division || "بدون"}</td>
              <td>{emp.jobTitle || emp.otherJobTitle || "-"}</td>
              {currentUser?.role !== "systemAdmin" && (
                <td>
                  <Button
                    size="sm"
                    variant="warning"
                    className="me-2"
                    onClick={() => navigate(`/edit-employee/${emp.id}`)}
                  >
                    تعديل
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(emp.id)}
                  >
                    حذف
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
