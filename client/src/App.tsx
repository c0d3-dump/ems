import Dashboard from "./components/local/dashboard";
import Departments from "./components/local/departments";
import Employees from "./components/local/employees";
import { Toaster } from "./components/ui/toaster";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Button } from "./components/ui/button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/ui/form";
import { Input } from "./components/ui/input";
import { env } from "./config";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  const setAuthenticated = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") ?? "{}");
      if (user && user.email && user.role) {
        setAuthenticated();
      }
    } catch (error) {
      console.log(error);
    }
  }, [setAuthenticated]);

  return (
    <>
      {!isAuthenticated ? (
        <LoginComponent setAuthenticated={setAuthenticated}></LoginComponent>
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

interface AddLoginComponentProps {
  setAuthenticated: () => void;
}

function LoginComponent(props: AddLoginComponentProps) {
  const form = useForm();

  const onLogin = useCallback(async () => {
    const email = form.getValues().email;
    const password = form.getValues().password;
    const res = await axios.post(`${env.SERVER_URL}/api/Users/Login`, {
      email,
      password,
    });

    console.log(JSON.stringify(res.data));

    localStorage.setItem("user", JSON.stringify(res.data));
    props.setAuthenticated();
  }, [form, props]);

  return (
    <>
      <Card className="w-[350px] mx-auto mt-52">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit" onClick={onLogin}>
            Submit
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

export default App;
