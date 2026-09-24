import { createBrowserRouter } from "react-router";
import ProtectedLayout from "../layouts/protected";
import Login from "../pages/auth/login";
import { Path } from "./routes";
import Signup from "../pages/auth/signup";
import BoardList from "../pages/protected/boardList";
import BoardDetails from "../pages/protected/boardDetails";
import AppLayout from "../layouts/app";
import Home from "../pages/home";
import AuthLayout from "../layouts/auth";

export const router = createBrowserRouter([
  {
    path: Path.Home,
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        element: <AuthLayout />,
        children: [
          { path: Path.Login, element: <Login /> },
          { path: Path.SignUp, element: <Signup /> },
        ],
      },
      {
        element: <ProtectedLayout />,
        children: [
          { path: Path.Boards, element: <BoardList /> },
          { path: `${Path.Boards}/:boardId`, element: <BoardDetails /> },
        ],
      },
    ],
  },
]);
