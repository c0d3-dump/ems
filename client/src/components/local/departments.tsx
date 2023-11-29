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
import { useAuth0 } from "@auth0/auth0-react";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { env } from "../../config";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

interface DepartmentState {
  departmentId: number;
  departmentName: string;
}

export default function Departments() {
  const { user } = useAuth0();
  const [departmentData, setDepartmentData] = useState<DepartmentState[]>();

  const fetchDepartments = useCallback(() => {
    axios.get(`${env.SERVER_URL}/api/Departments`).then((res) => {
      setDepartmentData(res.data);
    });
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const ondeleteDepartment = useCallback(
    (departmentId: number) => {
      axios
        .delete(`${env.SERVER_URL}/api/Departments/${departmentId}`)
        .then(() => {
          fetchDepartments();
        });
    },
    [fetchDepartments]
  );

  return (
    <>
      <Header></Header>

      {user?.nickname === "admin" ? (
        <div className="flex justify-end mb-6">
          <AddDepartmentComponent
            fetchDepartments={fetchDepartments}
          ></AddDepartmentComponent>
        </div>
      ) : (
        <></>
      )}

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Department Name</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-auto">
            {departmentData?.map((department) => (
              <TableRow key={department.departmentId}>
                <TableCell>{department.departmentId}</TableCell>
                <TableCell>{department.departmentName}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={user?.nickname !== "admin"}
                    onClick={() => ondeleteDepartment(department.departmentId)}
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

interface AddDepartmentComponentProps {
  fetchDepartments: () => void;
}

export function AddDepartmentComponent(props: AddDepartmentComponentProps) {
  const form = useForm();

  const onAddDepartment = useCallback(async () => {
    const departmentName = form.getValues().departmentname;
    await axios.post(`${env.SERVER_URL}/api/Departments`, { departmentName });
    props.fetchDepartments();
  }, [form, props]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Add Department</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Department</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <FormField
            control={form.control}
            name="departmentname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Department Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" onClick={onAddDepartment}>
              Submit
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
