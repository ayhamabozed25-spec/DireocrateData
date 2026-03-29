import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

import DepartmentsForm from "./components/DepartmentsForm";
import DivisionsForm from "./components/DivisionsForm";
import EmployeesForm from "./components/EmployeesForm";
import DevicesForm from "./components/DevicesForm";
import CarsForm from "./components/CarsForm";
import FurnitureForm from "./components/FurnitureForm";
import ProjectsForm from "./components/ProjectsForm";
import ProjectChallengesForm from "./components/ProjectChallengesForm";
import ServicesForm from "./components/ServicesForm";
import StrengthsWeaknessesForm from "./components/StrengthsWeaknessesForm";
import Search from "./components/Search";
import BuildingForm from "./components/BuildingForm";
import "leaflet/dist/leaflet.css";

function App() {
  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">الخطة التنفيذية</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/buildings">الأبنية</Nav.Link>
              <Nav.Link as={Link} to="/departments">الأقسام</Nav.Link>
              <Nav.Link as={Link} to="/divisions">الشعب</Nav.Link>
              <Nav.Link as={Link} to="/employees">الموظفون</Nav.Link>
              <Nav.Link as={Link} to="/devices">الأجهزة</Nav.Link>
              <Nav.Link as={Link} to="/cars">الآليات</Nav.Link>
              <Nav.Link as={Link} to="/furniture">الأثاث</Nav.Link>
              <Nav.Link as={Link} to="/projects">المشاريع</Nav.Link>
              <Nav.Link as={Link} to="/project-challenges">تحديات المشاريع</Nav.Link>
              <Nav.Link as={Link} to="/services">الخدمات</Nav.Link>
              <Nav.Link as={Link} to="/swot">SWOT</Nav.Link>
              <Nav.Link as={Link} to="/search">البحث</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
           <Route path="/buildings" element={<BuildingForm />} />
          <Route path="/departments" element={<DepartmentsForm />} />
          <Route path="/divisions" element={<DivisionsForm />} />
          <Route path="/employees" element={<EmployeesForm />} />
          <Route path="/devices" element={<DevicesForm />} />
          <Route path="/cars" element={<CarsForm />} />
          <Route path="/furniture" element={<FurnitureForm />} />
          <Route path="/projects" element={<ProjectsForm />} />
          <Route path="/project-challenges" element={<ProjectChallengesForm />} />
          <Route path="/services" element={<ServicesForm />} />
          <Route path="/swot" element={<StrengthsWeaknessesForm />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
