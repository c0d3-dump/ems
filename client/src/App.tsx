import { useAuth0 } from "@auth0/auth0-react";
import Dashboard from "./components/local/dashboard";
import Departments from "./components/local/departments";
import Employees from "./components/local/employees";
import { Toaster } from "./components/ui/toaster";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Button } from "./components/ui/button";

function App() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  const router = createBrowserRouter([
    {
      path: "/",
      Component: Dashboard,
    },
    {
      path: "/employees",
      Component: Employees,
    },
    {
      path: "/departments",
      Component: Departments,
    },
  ]);

  return (
    <>
      {!isAuthenticated ? (
        <Button onClick={() => loginWithRedirect()}>Login</Button>
      ) : (
        <>
          <div className="container">
            <RouterProvider router={router}></RouterProvider>
          </div>
          <Toaster></Toaster>
        </>
      )}
    </>
  );
}

export default App;
