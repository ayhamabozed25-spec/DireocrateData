
import InstitutionForm from "./components/InstitutionForm";
import StrengthsForm from "./components/StrengthsForm";
import DepartmentsForm from "./components/DepartmentsForm";
import EmployeesForm from "./components/EmployeesForm";
import AssetsForm from "./components/AssetsForm";
import Search from "./components/Search";

function App() {
  return (
    <div>
      <h1>وثيقة الخطة التنفيذية</h1>
      <InstitutionForm />
      <StrengthsForm institutionId="ID_OF_INSTITUTION" />
      <DepartmentsForm institutionId="ID_OF_INSTITUTION" />
      <EmployeesForm institutionId="ID_OF_INSTITUTION" departmentId="ID_OF_DEPARTMENT" />
      <AssetsForm institutionId="ID_OF_INSTITUTION" departmentId="ID_OF_DEPARTMENT" employeeId="ID_OF_EMPLOYEE" />
      <Search />
    </div>
  );
}

export default App;
