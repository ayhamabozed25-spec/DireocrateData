import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useAuth } from "./components/AuthContext";

import BuildingList from "./components/BuildingList";
import AddBuilding from "./components/AddBuilding";
import AddService from "./components/AddService";
import ServicesList from "./components/ServicesList";
import AddSwot from "./components/AddSwot";
import SwotList from "./components/SwotList";
import DepartmentsList from "./components/DepartmentsList";
import AddDepartment from "./components/AddDepartment";
import DivisionsList from "./components/DivisionsList";
import AddDivision from "./components/AddDivision";
import EmployeesList from "./components/EmployeesList";
import AddEmployee from "./components/AddEmployee";
import EditEmployee from "./components/EditEmployee";
import DevicesList from "./components/DevicesList";
import AddDevice from "./components/AddDevice";
import FurnitureList from "./components/FurnitureList";
import AddFurniture from "./components/AddFurniture";
import CarsList from "./components/CarsList";
import AddCar from "./components/AddCar";
import AddProject from "./components/AddProject";
import AddProjectChallenge from "./components/AddProjectChallenge";
import ProjectChallengesList from "./components/ProjectChallengesList";
import ProjectsList from "./components/ProjectsList";
import Dashboard from "./components/Dashboard";
import UsersManagement from "./components/UsersManagement";
import  LoginPage from "./components/LoginPage";

function App() {
  const { currentUser } = useAuth();

  const canSeeRestricted =
    currentUser?.role === "systemAdmin" ||
    currentUser?.role === "organizationManager";
  
 if (!currentUser) {
 console.log("cu" : + currentUser);
  return <LoginPage />;
}
  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">الخطة التنفيذية</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">

              {/* روابط متاحة للجميع */}
              <Nav.Link as={Link} to="/departments">الأقسام</Nav.Link>
              <Nav.Link as={Link} to="/divisions">الشعب</Nav.Link>
              <Nav.Link as={Link} to="/employees">الموظفون</Nav.Link>
              <Nav.Link as={Link} to="/devices">الأجهزة</Nav.Link>
              <Nav.Link as={Link} to="/cars">الآليات</Nav.Link>
              <Nav.Link as={Link} to="/furniture">الأثاث</Nav.Link>

              {/* روابط خاصة بالمدير والإدمن فقط */}
              {canSeeRestricted && (
                <>
                  <Nav.Link as={Link} to="/buildings">الأبنية</Nav.Link>
                  <Nav.Link as={Link} to="/projects">المشاريع</Nav.Link>
                  <Nav.Link as={Link} to="/project-challenges">تحديات المشاريع</Nav.Link>
                  <Nav.Link as={Link} to="/services">الخدمات</Nav.Link>
                  <Nav.Link as={Link} to="/swot">SWOT</Nav.Link>
                  <Nav.Link as={Link} to="/Dashboard">Dashboard</Nav.Link>
                 <Nav.Link as={Link} to="/ UsersManagement"> UsersManagement</Nav.Link>
                </>
              )}

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">


        <Routes>

          {/* الأبنية */}
          <Route
            path="/buildings"
            element={
              canSeeRestricted ? (
                <BuildingList />
              ) : (
                <h3 className="text-danger">غير مسموح لك بالوصول إلى هذه الصفحة</h3>
              )
            }
          />
          <Route
            path="/add-building"
            element={
              canSeeRestricted ? (
                <AddBuilding />
              ) : (
                <h3 className="text-danger">غير مسموح لك بالوصول إلى هذه الصفحة</h3>
              )
            }
          />

          {/* الأقسام والشعب والموظفون والأصول */}
          <Route path="/departments" element={<DepartmentsList />} />
          <Route path="/add-department" element={<AddDepartment />} />
          <Route path="/divisions" element={<DivisionsList />} />
          <Route path="/add-division" element={<AddDivision />} />
          <Route path="/employees" element={<EmployeesList />} />
          <Route path="/add-Employee" element={<AddEmployee />} />
          <Route path="/edit-employee/:id" element={<EditEmployee />} />
          <Route path="/devices" element={<DevicesList />} />
          <Route path="/add-Device" element={<AddDevice />} />
          <Route path="/cars" element={<CarsList />} />
          <Route path="/add-Car" element={<AddCar />} />
          <Route path="/furniture" element={<FurnitureList />} />
          <Route path="/add-Furniture" element={<AddFurniture />} />

          {/* المشاريع */}
          <Route
            path="/projects"
            element={
              canSeeRestricted ? (
                <ProjectsList />
              ) : (
                <h3 className="text-danger">غير مسموح لك بالوصول إلى هذه الصفحة</h3>
              )
            }
          />
          <Route
            path="/add-Project"
            element={
              canSeeRestricted ? (
                <AddProject />
              ) : (
                <h3 className="text-danger">غير مسموح لك بالوصول إلى هذه الصفحة</h3>
              )
            }
          />

          {/* تحديات المشاريع */}
          <Route
            path="/project-challenges"
            element={
              canSeeRestricted ? (
                <ProjectChallengesList />
              ) : (
                <h3 className="text-danger">غير مسموح لك بالوصول إلى هذه الصفحة</h3>
              )
            }
          />
          <Route
            path="/add-ProjectChallenge"
            element={
              canSeeRestricted ? (
                <AddProjectChallenge />
              ) : (
                <h3 className="text-danger">غير مسموح لك بالوصول إلى هذه الصفحة</h3>
              )
            }
          />

          {/* الخدمات */}
          <Route
            path="/services"
            element={
              canSeeRestricted ? (
                <ServicesList />
              ) : (
                <h3 className="text-danger">غير مسموح لك بالوصول إلى هذه الصفحة</h3>
              )
            }
          />
          <Route
            path="/add"
            element={
              canSeeRestricted ? (
                <AddService />
              ) : (
                <h3 className="text-danger">غير مسموح لك بالوصول إلى هذه الصفحة</h3>
              )
            }
          />

          {/* SWOT */}
          <Route
            path="/swot"
            element={
              canSeeRestricted ? (
                <SwotList />
              ) : (
                <h3 className="text-danger">غير مسموح لك بالوصول إلى هذه الصفحة</h3>
              )
            }
          />
          <Route
            path="/add-swot"
            element={
              canSeeRestricted ? (
                <AddSwot />
              ) : (
                <h3 className="text-danger">غير مسموح لك بالوصول إلى هذه الصفحة</h3>
              )
            }
          />

          {/* Dashboard */}
          <Route
            path="/Dashboard"
            element={
              canSeeRestricted ? (
                <Dashboard />
              ) : (
                <h3 className="text-danger">غير مسموح لك بالوصول إلى هذه الصفحة</h3>
              )
            }
          />
               {/* UsersManagement */}
          <Route
            path="/UsersManagement"
            element={
              canSeeRestricted ? (
                <UsersManagement />
              ) : (
                <h3 className="text-danger">غير مسموح لك بالوصول إلى هذه الصفحة</h3>
              )
            }
          />

        </Routes>
      </Container>
    </Router>
  );
}

export default App;
