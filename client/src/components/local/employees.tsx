import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Header from "./header";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useAuth0 } from "@auth0/auth0-react";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { env } from "../../config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface EmployeeState {
  userId: number;
  email: string;
  name: string;
  department: {
    departmentName: string;
  };
}

export default function Employees() {
  const { user } = useAuth0();
  const [employeeData, setEmployeeData] = useState<EmployeeState[]>();

  const fetchEmployees = useCallback(() => {
    axios.get(`${env.SERVER_URL}/api/Users`).then((res) => {
      setEmployeeData(res.data);
    });
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const ondeleteEmployee = useCallback(
    (employeeId: number) => {
      axios.delete(`${env.SERVER_URL}/api/Users/${employeeId}`).then(() => {
        fetchEmployees();
      });
    },
    [fetchEmployees]
  );

  return (
    <>
      <Header></Header>

      {user?.nickname === "admin" ? (
        <div className="flex justify-end mb-6">
          <AddEmployeeComponent
            fetchEmployees={fetchEmployees}
          ></AddEmployeeComponent>
        </div>
      ) : (
        <></>
      )}

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-auto">
            {employeeData?.map((employee) => (
              <TableRow key={employee.userId}>
                <TableCell>{employee.userId}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.department.departmentName}</TableCell>
                <TableCell className="text-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={user?.nickname !== "admin"}
                    onClick={() => ondeleteEmployee(employee.userId)}
                  >
                    <Trash></Trash>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

interface DepartmentState {
  departmentId: number;
  departmentName: string;
}

interface AddEmployeeComponentProps {
  fetchEmployees: () => void;
}

export function AddEmployeeComponent(props: AddEmployeeComponentProps) {
  const formSchema = z.object({
    name: z.string({ required_error: "Name is required" }).min(1).max(25),
    email: z.string({ required_error: "Email is required" }).min(1).max(100),
    password: z
      .string({ required_error: "Password is required" })
      .min(1)
      .max(25),
    role: z.string({ required_error: "Role is required" }).min(1).max(25),
    department: z
      .string({ required_error: "Department is required" })
      .min(1)
      .max(25),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [departmentData, setDepartmentData] = useState<DepartmentState[]>();

  useEffect(() => {
    axios.get(`${env.SERVER_URL}/api/Departments`).then((res) => {
      setDepartmentData(res.data);
    });
  }, []);

  const onAddEmployee = useCallback(async () => {
    const employeeData = {
      email: form.getValues().email,
      password: form.getValues().password,
      role: form.getValues().role,
      name: form.getValues().name,
      departmentId: parseInt(form.getValues().department),
    };

    await axios.post(`${env.SERVER_URL}/api/Users`, employeeData);
    props.fetchEmployees();
  }, [form, props]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Add Employee</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Employee</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Email" type="email" {...field} />
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
                  <Input
                    placeholder="Enter Password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>

                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>

                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departmentData?.map((department) => (
                      <SelectItem
                        key={department.departmentId}
                        value={department.departmentId.toString()}
                      >
                        {department.departmentName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="submit"
              disabled={!form.formState.isValid}
              onClick={onAddEmployee}
            >
              Submit
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}