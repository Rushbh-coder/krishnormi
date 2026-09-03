import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import AdminLogin from './pages/AdminLogin'
import Dashboard from './pages/admin/Dashboard'
import HomePageEditor from './pages/admin/HomePageEditor'
import AdminSettings from './pages/admin/AdminSettings'
import RequireAdminAuth from './components/RequireAdminAuth'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <RequireAdminAuth>
            <Dashboard />
          </RequireAdminAuth>
        }
      />
      <Route
        path="/admin/home-page"
        element={
          <RequireAdminAuth>
            <HomePageEditor />
          </RequireAdminAuth>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <RequireAdminAuth>
            <AdminSettings />
          </RequireAdminAuth>
        }
      />
    </Routes>
  )
}

export default App
