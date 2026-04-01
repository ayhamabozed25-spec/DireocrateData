export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const snap = await getDocs(collection(db, "users"));
    setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const saveUser = async () => {
    const ref = doc(db, "users", editingUser.id);
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
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.departmentId || "-"}</td>
              <td>{u.divisionId || "-"}</td>
              <td>
                <Button size="sm" onClick={() => setEditingUser(u)}>تعديل</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {editingUser && (
        <Modal show onHide={() => setEditingUser(null)}>
          <Modal.Header closeButton>
            <Modal.Title>تعديل المستخدم</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>الدور</Form.Label>
                <Form.Select
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                >
                  <option value="systemAdmin">مسؤول نظام</option>
                  <option value="organizationManager">مدير مؤسسة</option>
                  <option value="departmentManager">مسؤول قسم</option>
                  <option value="divisionManager">مسؤول شعبة</option>
                  <option value="normalUser">مستخدم عادي</option>
                </Form.Select>
              </Form.Group>

              {(editingUser.role === "departmentManager" ||
                editingUser.role === "divisionManager") && (
                <Form.Group>
                  <Form.Label>القسم</Form.Label>
                  <Form.Control
                    value={editingUser.departmentId || ""}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, departmentId: e.target.value })
                    }
                  />
                </Form.Group>
              )}

              {editingUser.role === "divisionManager" && (
                <Form.Group>
                  <Form.Label>الشعبة</Form.Label>
                  <Form.Control
                    value={editingUser.divisionId || ""}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, divisionId: e.target.value })
                    }
                  />
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
