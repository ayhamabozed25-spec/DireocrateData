import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

import BuildingList from "./components/BuildingList";
import AddBuilding from "./components/AddBuilding";
import "leaflet/dist/leaflet.css";
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
             <Nav.Link as={Link} to="/Dashboard">Dashboard</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
           <Route path="/buildings" element={<BuildingList />} />
          <Route path="/add-building" element={<AddBuilding />} />
          <Route path="/departments" element={<DepartmentsList />} />
          <Route path="/add-department" element={<AddDepartment />} />
            <Route path="/divisions" element={<DivisionsList />} />
          <Route path="/add-division" element={<AddDivision />} />
          <Route path="/employees" element={<EmployeesList />} />
          <Route path="/devices" element={<DevicesList />} />
          <Route path="/cars" element={<CarsList />} />
          <Route path="/furniture" element={<FurnitureList />} />
          <Route path="/projects" element={<ProjectsList />} />
          <Route path="/project-challenges" element={<ProjectChallengesList />} />
          <Route path="/services" element={<ServicesList />} />
          <Route path="/add" element={<AddService />} />
           <Route path="/swot" element={<SwotList />} />
           <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/add-swot" element={<AddSwot />} />
         <Route path="/add-Employee" element={<AddEmployee />} />
         <Route path="/Edit-Employee" element={<EditEmployee />} />
         <Route path="/add-Device" element={<AddDevice />} />
         <Route path="/add-Car" element={<AddCar />} />
        <Route path="/add-Furniture" element={<AddFurniture />} />
        <Route path="/add-Project" element={<AddProject />} />
        <Route path="/add-ProjectChallenge" element={<AddProjectChallenge />} />

  
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
