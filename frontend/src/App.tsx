import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register'
import DashboardLayout from "./components/DashboardLayout";
import VolunteerDashboardHome from "./pages/dashboards/Volunteer/VolunteerDashboardHome";
import VolunteerTasks from "./pages/dashboards/Volunteer/VolunteerTasks";
import VolunteerProfile from "./pages/dashboards/Volunteer/VolunteerProfile";
import HrDashboard from './pages/dashboards/HrDashboard';
import NonprofitDashboardLayout from "./components/NonprofitDashboardLayout";
import DashboardHome from "./pages/dashboards/Nonprofit/DashboardHome";
import NonprofitTasks from "./pages/dashboards/Nonprofit/NonprofitTasks";
import NonprofitViewTask from './pages/dashboards/Nonprofit/NonprofitViewTask';
import NonprofitCreateTask from "./pages/dashboards/Nonprofit/NonprofitCreateTask";
import NonprofitProfile from "./pages/dashboards/Nonprofit/Profile";
import VolunteerViewTask from './pages/dashboards/Volunteer/VolunteerViewTask';



import { Navigate } from 'react-router-dom';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard/volunteer" element={<DashboardLayout />}>
          <Route index element={<VolunteerDashboardHome />} />
          <Route path="tasks" element={<VolunteerTasks />} />
          <Route path="profile" element={<VolunteerProfile />} />
          <Route path="/dashboard/volunteer/tasks/:id" element={<VolunteerViewTask />} />
        </Route>
        <Route path="/volunteer/dashboard" element={<Navigate to="/dashboard/volunteer" replace />} />



        <Route path="/dashboard/nonprofit" element={<NonprofitDashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="tasks" element={<NonprofitTasks />} />
          <Route path="create-task" element={<NonprofitCreateTask />} />
          <Route path="/dashboard/nonprofit/profile" element={<NonprofitProfile />} />
          <Route path="/dashboard/nonprofit/tasks/:id" element={<NonprofitViewTask />} />
        </Route>
        <Route path="/dashboard/hr" element={<HrDashboard />} />

        <Route path="/logout" element={<div>Logging out...</div>} />

      </Routes>
    </Router>
  );
}

export default App;
