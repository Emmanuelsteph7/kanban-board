import { Outlet } from "react-router";
import AuthProvider from "../../contexts/auth";
import TanstackProvider from "../../contexts/tanstack";

const AppLayout = () => {
  return (
    <TanstackProvider>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </TanstackProvider>
  );
};

export default AppLayout;
