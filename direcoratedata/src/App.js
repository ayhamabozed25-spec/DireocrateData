import 'bootstrap/dist/css/bootstrap.min.css';
import DepartmentsForm from "./components/DepartmentsForm";
import EmployeesForm from "./components/EmployeesForm";
import Search from "./components/Search";

function App() {
  return (
    <div className="container mt-4">
      <h1 className="mb-4">وثيقة الخطة التنفيذية</h1>
      <DepartmentsForm />
      <EmployeesForm />
      <Search />
    </div>
  );
}

export default App;
