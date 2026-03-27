import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";

export default function Search() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "employees"));
      setData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "employees", id));
    setData(data.filter(item => item.id !== id));
  };

  const handleUpdate = async (id) => {
    const newName = prompt("أدخل الاسم الجديد:");
    if (newName) {
      await updateDoc(doc(db, "employees", id), { name: newName });
      setData(data.map(item => item.id === id ? { ...item, name: newName } : item));
    }
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>الاسم</th>
          <th>العمر</th>
          <th>الهاتف</th>
          <th>إجراءات</th>
        </tr>
      </thead>
      <tbody>
        {data.map(item => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.age}</td>
            <td>{item.phone}</td>
            <td>
              <Button variant="warning" onClick={() => handleUpdate(item.id)}>تعديل</Button>{' '}
              <Button variant="danger" onClick={() => handleDelete(item.id)}>حذف</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
