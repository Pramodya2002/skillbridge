import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register'
import DashboardLayout from "./components/DashboardLayout";
import VolunteerDashboardHome from "./pages/dashboards/Volunteer/VolunteerDashboardHome";
import VolunteerTasks from "./pages/dashboards/Volunteer/VolunteerTasks";
import VolunteerProfile from "./pages/dashboards/Volunteer/VolunteerProfile";
import NonprofitDashboard from './pages/dashboards/NonprofitDashboard';
import HrDashboard from './pages/dashboards/HrDashboard';
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
        </Route>
        <Route path="/volunteer/dashboard" element={<Navigate to="/dashboard/volunteer" replace />} />



        <Route path="/dashboard/nonprofit" element={<NonprofitDashboard />} />
        <Route path="/dashboard/hr" element={<HrDashboard />} />

        <Route path="/logout" element={<div>Logging out...</div>} />

      </Routes>
    </Router>
  );
}

export default App;
