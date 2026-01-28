import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") {
        // If user is not logged in or not admin, redirect to admin login
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default AdminProtectedRoute;
