import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../contexts/auth";
import { Path } from "../../navigations/routes";

const ProtectedLayout = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={Path.Login} replace />;
  }

  return <Outlet />;
};

export default ProtectedLayout;
