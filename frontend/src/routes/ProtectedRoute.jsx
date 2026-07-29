// Route guard that redirects unauthenticated users to login and blocks back-button access
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const blockBackNavigation = () => {
      if (!user) {
        window.history.replaceState(null, "", "/login");
      }
    };
    window.addEventListener("popstate", blockBackNavigation);
    return () => window.removeEventListener("popstate", blockBackNavigation);
  }, [user]);

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
