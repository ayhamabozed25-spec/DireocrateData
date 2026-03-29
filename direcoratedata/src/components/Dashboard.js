// Dashboard.jsx
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Card, Row, Col } from "react-bootstrap";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement
);

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [cars, setCars] = useState([]);
  const [furniture, setFurniture] = useState([]);

  // تحميل البيانات من Firestore
  useEffect(() => {
    const load = async () => {
      const empSnap = await getDocs(collection(db, "employees"));
      const projSnap = await getDocs(collection(db, "projects"));
      const challSnap = await getDocs(collection(db, "projectChallenges"));
      let carsSnap = null;
      let furnSnap = null;

      try {
        carsSnap = await getDocs(collection(db, "cars"));
      } catch (e) {
        carsSnap = { docs: [] };
      }

      try {
        furnSnap = await getDocs(collection(db, "furniture"));
      } catch (e) {
        furnSnap = { docs: [] };
      }

      setEmployees(empSnap.docs.map(d => d.data()));
      setProjects(projSnap.docs.map(d => d.data()));
      setChallenges(challSnap.docs.map(d => d.data()));
      setCars(carsSnap.docs.map(d => d.data()));
      setFurniture(furnSnap.docs.map(d => d.data()));
    };
    load();
  }, []);

  // ============================
  // مؤشرات أداء الموظفين
  // ============================
  const totalEmployees = employees.length;
  const vacantEmployees = employees.filter(e => e.need === "شاغر").length;
  const availableEmployees = employees.filter(e => e.need === "متوفر").length;

  const vacancyRate =
    totalEmployees > 0 ? ((vacantEmployees / totalEmployees) * 100).toFixed(1) : 0;

  const matchingEmployees = employees.filter(e => e.matchCertificate === "نعم").length;
  const matchingRate =
    availableEmployees > 0
      ? ((matchingEmployees / availableEmployees) * 100).toFixed(1)
      : 0;

  const avgSalary =
    availableEmployees > 0
      ? (
          employees
            .filter(e => e.salary)
            .reduce((sum, e) => sum + Number(e.salary), 0) / availableEmployees
        ).toFixed(2)
      : 0;

  // توزيع الموظفين حسب القسم
  const employeesByDepartment = employees.reduce((acc, emp) => {
    const dep = emp.department || "غير محدد";
    acc[dep] = (acc[dep] || 0) + 1;
    return acc;
  }, {});

  // توزيع الموظفين حسب المؤهل
  const employeesByQualification = employees.reduce((acc, emp) => {
    const q = emp.qualification || "غير محدد";
    acc[q] = (acc[q] || 0) + 1;
    return acc;
  }, {});

  // ============================
  // مؤشرات أداء المشاريع
  // ============================
  const startedProjects = projects.filter(p => p.startDate).length;
  const finishedProjects = projects.filter(p => p.endDate).length;

  const projectStartRate =
    projects.length > 0 ? ((startedProjects / projects.length) * 100).toFixed(1) : 0;

  const projectFinishRate =
    projects.length > 0 ? ((finishedProjects / projects.length) * 100).toFixed(1) : 0;

  const projectNames = projects.map(p => p.name || "بدون اسم");
  const projectBudgets = projects.map(p => Number(p.budget) || 0);

  // ============================
  // مؤشرات أداء التحديات
  // ============================
  const challengeCategories = challenges.reduce((acc, ch) => {
    const cat = ch.category || "غير محدد";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  // ============================
  // مؤشرات أداء الآليات
  // ============================
  const carsStatus = cars.reduce((acc, car) => {
    const st = car.status || "غير محدد";
    acc[st] = (acc[st] || 0) + 1;
    return acc;
  }, {});

  const goodCars = cars.filter(
    c => c.status === "جيد" || c.status === "جيد جداً" || c.status === "جيد جدا"
  ).length;
  const carHealthRate =
    cars.length > 0 ? ((goodCars / cars.length) * 100).toFixed(1) : 0;

  // ============================
  // مؤشرات أداء الأثاث
  // ============================
  const furnitureStatus = furniture.reduce((acc, item) => {
    const st = item.status || "غير محدد";
    acc[st] = (acc[st] || 0) + 1;
    return acc;
  }, {});

  const goodFurniture = furniture.filter(
    f => f.status === "جيد" || f.status === "جيد جدا" || f.status === "جيد جداً"
  ).length;
  const furnitureHealthRate =
    furniture.length > 0 ? ((goodFurniture / furniture.length) * 100).toFixed(1) : 0;

  return (
    <div className="p-3">
      <h2 className="mb-4">لوحة التحكم العامة</h2>

      {/* مؤشرات الأداء - الصف الأول */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="p-3 shadow-sm text-center">
            <h6>عدد الموظفين</h6>
            <h2>{totalEmployees}</h2>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="p-3 shadow-sm text-center">
            <h6>نسبة الشواغر</h6>
            <h2>{vacancyRate}%</h2>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="p-3 shadow-sm text-center">
            <h6>مطابقة الشهادات</h6>
            <h2>{matchingRate}%</h2>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="p-3 shadow-sm text-center">
            <h6>متوسط الرواتب</h6>
            <h2>${avgSalary}</h2>
          </Card>
        </Col>
      </Row>

      {/* مؤشرات الأداء - الصف الثاني */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="p-3 shadow-sm text-center">
            <h6>عدد المشاريع</h6>
            <h2>{projects.length}</h2>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="p-3 shadow-sm text-center">
            <h6>مشاريع بدأت</h6>
            <h2>{projectStartRate}%</h2>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="p-3 shadow-sm text-center">
            <h6>مشاريع منتهية</h6>
            <h2>{projectFinishRate}%</h2>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="p-3 shadow-sm text-center">
            <h6>عدد التحديات</h6>
            <h2>{challenges.length}</h2>
          </Card>
        </Col>
      </Row>

      {/* مؤشرات الآليات والأثاث */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="p-3 shadow-sm text-center">
            <h6>عدد الآليات</h6>
            <h2>{cars.length}</h2>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="p-3 shadow-sm text-center">
            <h6>صحة الآليات</h6>
            <h2>{carHealthRate}%</h2>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="p-3 shadow-sm text-center">
            <h6>عدد قطع الأثاث</h6>
            <h2>{furniture.length}</h2>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="p-3 shadow-sm text-center">
            <h6>صحة الأثاث</h6>
            <h2>{furnitureHealthRate}%</h2>
          </Card>
        </Col>
      </Row>

      {/* مخططات الموظفين */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="p-3 shadow-sm">
            <h5>عدد الموظفين حسب الأقسام</h5>
            <Bar
              data={{
                labels: Object.keys(employeesByDepartment),
                datasets: [
                  {
                    label: "عدد الموظفين",
                    data: Object.values(employeesByDepartment),
                    backgroundColor: "#4e73df"
                  }
                ]
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
              height={250}
            />
          </Card>
        </Col>

        <Col md={6}>
          <Card className="p-3 shadow-sm">
            <h5>المؤهلات العلمية للموظفين</h5>
            <Pie
              data={{
                labels: Object.keys(employeesByQualification),
                datasets: [
                  {
                    data: Object.values(employeesByQualification),
                    backgroundColor: [
                      "#1cc88a",
                      "#36b9cc",
                      "#f6c23e",
                      "#e74a3b",
                      "#858796",
                      "#4e73df"
                    ]
                  }
                ]
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
              height={250}
            />
          </Card>
        </Col>
      </Row>

      {/* مخطط المشاريع */}
      <Row className="mb-4">
        <Col md={12}>
          <Card className="p-3 shadow-sm">
            <h5>ميزانيات المشاريع</h5>
            <Line
              data={{
                labels: projectNames,
                datasets: [
                  {
                    label: "الميزانية",
                    data: projectBudgets,
                    borderColor: "#e74a3b",
                    backgroundColor: "rgba(231, 74, 59, 0.3)",
                    tension: 0.3
                  }
                ]
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
              height={260}
            />
          </Card>
        </Col>
      </Row>

      {/* التحديات والآليات */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="p-3 shadow-sm">
            <h5>التحديات حسب الفئة</h5>
            <Pie
              data={{
                labels: Object.keys(challengeCategories),
                datasets: [
                  {
                    data: Object.values(challengeCategories),
                    backgroundColor: ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e"]
                  }
                ]
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
              height={250}
            />
          </Card>
        </Col>

        <Col md={6}>
          <Card className="p-3 shadow-sm">
            <h5>حالة الآليات</h5>
            <Bar
              data={{
                labels: Object.keys(carsStatus),
                datasets: [
                  {
                    label: "عدد الآليات",
                    data: Object.values(carsStatus),
                    backgroundColor: "#36b9cc"
                  }
                ]
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
              height={250}
            />
          </Card>
        </Col>
      </Row>

      {/* الأثاث */}
      <Row className="mb-4">
        <Col md={12}>
          <Card className="p-3 shadow-sm">
            <h5>حالة الأثاث</h5>
            <Bar
              data={{
                labels: Object.keys(furnitureStatus),
                datasets: [
                  {
                    label: "عدد القطع",
                    data: Object.values(furnitureStatus),
                    backgroundColor: "#1cc88a"
                  }
                ]
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
              height={250}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
