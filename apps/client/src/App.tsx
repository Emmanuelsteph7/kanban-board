import { RouterProvider } from "react-router";
import { router } from "./navigations/router";
import { Toaster } from "./components/toast";

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
};

export default App;
