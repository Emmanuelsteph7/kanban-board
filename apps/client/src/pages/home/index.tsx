import { Navigate } from "react-router";
import { useAuth } from "../../contexts/auth";
import { Path } from "../../navigations/routes";

const Home = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={Path.Boards} replace />;
  }

  return <Navigate to={Path.Login} replace />;
};

export default Home;
