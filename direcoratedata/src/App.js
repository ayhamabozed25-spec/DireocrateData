import 'bootstrap/dist/css/bootstrap.min.css';
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

function App() {
  return (
    <div className="container mt-4">
      <h1 className="mb-4">وثيقة الخطة التنفيذية</h1>
      <DepartmentsForm />
      <DivisionsForm />
      <EmployeesForm />
      <DevicesForm />
      <CarsForm />
      <FurnitureForm />
      <ProjectsForm />
      <ProjectChallengesForm />
      <ServicesForm />
      <StrengthsWeaknessesForm />
      <Search />
    </div>
  );
}

export default App;
