import { CalendarIcon, Trash } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { cn } from "../../lib/utils";
import { Calendar } from "../ui/calendar";

interface EmployeeState {
  userId: number;
  email: string;
  name: string;
  department: {
    departmentName: string;
  };
}

export interface UserState {
  email: string;
  role: string;
}

export default function Employees() {
  const [employeeData, setEmployeeData] = useState<EmployeeState[]>();
  const [user, setUser] = useState<UserState>();

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") ?? "{}");
      if (user) {
        setUser(user);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchEmployees = useCallback(() => {
    axios.get(`${env.SERVER_URL}/api/Users`).then((res) => {
      setEmployeeData(res.data);
    });
  }, []);

  useEffect(() => {
    if (user?.email) {
      fetchEmployees();
    }
  }, [fetchEmployees, user?.email]);

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

      {user?.role === "admin" ? (
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
                    disabled={user?.role !== "admin"}
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
    dob: z.date(),
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
      birthDate: form.getValues().dob,
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
            name="dob"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      onSelect={field.onChange}
                      selected={field.value}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
