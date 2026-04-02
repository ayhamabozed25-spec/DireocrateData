import { Form, Button, Table, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const [departments, setDepartments] = useState([]);
  const [divisions, setDivisions] = useState([]);

  useEffect(() => {
    loadUsers();
    loadDepartments();
    loadDivisions(editingUser.departmentName);

  }, []);

  // تحميل المستخدمين
  const loadUsers = async () => {
    const snap = await getDocs(collection(db, "dir_users"));
    setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  // تحميل الأقسام
  const loadDepartments = async () => {
    const snap = await getDocs(collection(db, "departments"));
    setDepartments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  // تحميل الشعب حسب القسم المختار
const loadDivisions = async (departmentName) => {
  const snap = await getDocs(collection(db, "divisions"));

  const filtered = snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((div) => div.department === departmentName);

  setDivisions(filtered);
};


  // تحديث الشعب عند تغيير القسم
  useEffect(() => {
    if (editingUser?.departmentId) {
      loadDivisions(editingUser.departmentId);
    }
  }, [editingUser?.departmentId]);

  // حفظ التعديلات
  const saveUser = async () => {
    const ref = doc(db, "dir_users", editingUser.id);
    await updateDoc(ref, editingUser);
    setEditingUser(null);
    loadUsers();
  };

  return (
    <div className="p-3">
      <h3>إدارة المستخدمين</h3>

      <Table bordered hover>
        <thead>
          <tr>
            <th>الاسم</th>
            <th>البريد</th>
            <th>الدور</th>
            <th>القسم</th>
            <th>الشعبة</th>
            <th>إجراءات</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.departmentId || "-"}</td>
              <td>{u.divisionId || "-"}</td>
              <td>
                <Button size="sm" onClick={() => setEditingUser(u)}>
                  تعديل
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* نافذة التعديل */}
      {editingUser && (
        <Modal show onHide={() => setEditingUser(null)}>
          <Modal.Header closeButton>
            <Modal.Title>تعديل المستخدم</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              {/* الاسم */}
              <Form.Group className="mb-3">
                <Form.Label>الاسم</Form.Label>
                <Form.Control
                  value={editingUser.name || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                />
              </Form.Group>

    

              {/* الدور */}
              <Form.Group className="mb-3">
                <Form.Label>الدور</Form.Label>
                <Form.Select
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                >
                  <option value="systemAdmin">مسؤول نظام</option>
                  <option value="institutionManager">مدير مؤسسة</option>
                  <option value="departmentManager">مسؤول قسم</option>
                  <option value="divisionManager">مسؤول شعبة</option>
                  <option value="normalUser">مستخدم عادي</option>
                </Form.Select>
              </Form.Group>

              {/* القسم */}
              {(editingUser.role === "departmentManager" ||
                editingUser.role === "divisionManager") && (
                <Form.Group className="mb-3">
                  <Form.Label>القسم</Form.Label>
              <Form.Select
  value={editingUser.departmentName || ""}
  onChange={(e) =>
    setEditingUser({
      ...editingUser,
      departmentName: e.target.value,
      divisionId: "",
    })
  }
>
  <option value="">اختر القسم</option>
  {departments.map((d) => (
    <option key={d.id} value={d.name}>
      {d.name}
    </option>
  ))}
</Form.Select>

                </Form.Group>
              )}

              {/* الشعبة */}
              {editingUser.role === "divisionManager" && (
                <Form.Group className="mb-3">
                  <Form.Label>الشعبة</Form.Label>
                  <Form.Select
                    value={editingUser.divisionId || ""}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        divisionId: e.target.value,
                      })
                    }
                  >
                    <option value="">اختر الشعبة</option>
                    {divisions.map((div) => (
                      <option key={div.id} value={div.id}>
                        {div.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={saveUser}>حفظ</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
