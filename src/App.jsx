import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './layouts/DashboardLayout';
import { TestChecklist } from './pages/TestChecklist';
import { ShipPlatform } from './pages/ShipPlatform';
import {
  Dashboard,
  Practice,
  Assessments,
  Resources,
  Profile,
  History,
  Results
} from './pages/AppPages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Dashboard/App Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/assessments" element={<Assessments />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/history" element={<History />} />
          <Route path="/results/:id?" element={<Results />} />
        </Route>

        {/* Developer / QA Routes */}
        <Route path="/prp/07-test" element={<TestChecklist />} />
        <Route path="/prp/08-ship" element={<ShipPlatform />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
