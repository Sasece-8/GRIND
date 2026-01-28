import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./index.css";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import MainLayout from "./components/Layout.jsx";
import Course from "./pages/Course.jsx";
import EducatorRequest from "./pages/EducatorRequest.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminProtectedRoute from "./components/AdminProtectedRoute.jsx";
import StudentProfile from "./pages/StudentProfile.jsx";
import EducatorProfile from "./pages/EducatorProfile.jsx";
import Courses from "./pages/Courses.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { isTokenExpired } from "./lib/auth";


function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && isTokenExpired(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/course/:courseId" element={
          <ErrorBoundary>
            <Course />
          </ErrorBoundary>
        } />
        <Route path="/educatorVerify" element={<EducatorRequest />} />
        <Route path="/courses" element={<Courses />} />

        {/* Profile Routes */}
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/educator/profile" element={<EducatorProfile />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <AdminProtectedRoute>
            <MainLayout>
              <AdminDashboard />
            </MainLayout>
          </AdminProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;
