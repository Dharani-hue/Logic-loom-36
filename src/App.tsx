import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import InputPanelPage from './pages/InputPanelPage';
import FamilyDashboardPage from './pages/FamilyDashboardPage';
import styles from './styles/App.module.css';
import PageTransition from './components/PageTransition';
import { UserRole } from './types';

function App() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const location = useLocation();

  const showNavbar = location.pathname !== '/login';

  const authRoutes = useMemo(
    () => ({
      ngo: ['/home', '/input'],
      family: ['/family'],
    }),
    [],
  );

  return (
    <div className={styles.appShell}>
      {showNavbar && <Navbar role={userRole} onLogout={() => setUserRole(null)} />}
      <main className={styles.pageCanvas}>
        <PageTransition key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage onLogin={setUserRole} />} />
            <Route
              path="/home"
              element={userRole === 'ngo' ? <HomePage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/input"
              element={userRole === 'ngo' ? <InputPanelPage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/family"
              element={userRole === 'family' ? <FamilyDashboardPage /> : <Navigate to="/login" replace />}
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </PageTransition>
      </main>
    </div>
  );
}

export default App;
