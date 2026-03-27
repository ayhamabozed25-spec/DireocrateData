import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button } from "react-bootstrap";

export default function EmployeesForm() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "employees"), {
      name: e.target.name.value,
      gender: e.target.gender.value,
      age: e.target.age.value,
      phone: e.target.phone.value,
      qualification: e.target.qualification.value,
      specialization: e.target.specialization.value,
      startDate: e.target.startDate.value,
      contract: e.target.contract.value,
      jobTitle: e.target.jobTitle.value,
      jobCategory: e.target.jobCategory.value,
      salary: e.target.salary.value,
      task: e.target.task.value,
      status: e.target.status.value,
      endDate: e.target.endDate.value,
      need: e.target.need.value,
    });
    alert("تم حفظ الموظف ✅");
    e.target.reset();
  };

  return (
    <Form onSubmit={handleSubmit} className="p-3">
      <Form.Group><Form.Label>اسم الموظف</Form.Label><Form.Control name="name" /></Form.Group>
      <Form.Group><Form.Label>الجنس</Form.Label><Form.Control name="gender" /></Form.Group>
      <Form.Group><Form.Label>العمر</Form.Label><Form.Control type="number" name="age" /></Form.Group>
      <Form.Group><Form.Label>الهاتف</Form.Label><Form.Control name="phone" /></Form.Group>
      <Form.Group><Form.Label>المؤهل</Form.Label><Form.Control name="qualification" /></Form.Group>
      <Form.Group><Form.Label>التخصص</Form.Label><Form.Control name="specialization" /></Form.Group>
      <Form.Group><Form.Label>تاريخ المباشرة</Form.Label><Form.Control type="date" name="startDate" /></Form.Group>
      <Form.Group><Form.Label>نوع العقد</Form.Label><Form.Control name="contract" /></Form.Group>
      <Form.Group><Form.Label>المسمى الوظيفي</Form.Label><Form.Control name="jobTitle" /></Form.Group>
      <Form.Group><Form.Label>الفئة</Form.Label><Form.Control name="jobCategory" /></Form.Group>
      <Form.Group><Form.Label>الراتب</Form.Label><Form.Control type="number" name="salary" /></Form.Group>
      <Form.Group><Form.Label>المهام</Form.Label><Form.Control name="task" /></Form.Group>
      <Form.Group><Form.Label>الحالة</Form.Label><Form.Control name="status" /></Form.Group>
      <Form.Group><Form.Label>تاريخ الانتهاء</Form.Label><Form.Control type="date" name="endDate" /></Form.Group>
      <Form.Group><Form.Label>الحاجة</Form.Label><Form.Control name="need" /></Form.Group>
      <Button type="submit" className="mt-3">حفظ الموظف</Button>
    </Form>
  );
}
