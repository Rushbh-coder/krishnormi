import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import ContactUs from "./pages/ContactUs";
import AboutUsPage from "./pages/AboutUsPage";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import HomePageEditor from "./pages/admin/HomePageEditor";
import AdminSettings from "./pages/admin/AdminSettings";
import ContactPageEditor from "./pages/admin/ContactPageEditor";
import AboutUsPageEditor from "./pages/admin/AboutUsPageEditor";
import Appointments from "./pages/admin/Appointments";
import RequireAdminAuth from "./components/RequireAdminAuth";
import WhatsAppButton from "./components/WhatsAppButton";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/about-us" element={<AboutUsPage />} />
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
        <Route
          path="/admin/contact-page"
          element={
            <RequireAdminAuth>
              <ContactPageEditor />
            </RequireAdminAuth>
          }
        />
        <Route
          path="/admin/about-page"
          element={
            <RequireAdminAuth>
              <AboutUsPageEditor />
            </RequireAdminAuth>
          }
        />
        <Route
          path="/admin/appointments"
          element={
            <RequireAdminAuth>
              <Appointments />
            </RequireAdminAuth>
          }
        />
      </Routes>
      {!isAdminRoute && <WhatsAppButton />}
    </>
  );
}

export default App;
