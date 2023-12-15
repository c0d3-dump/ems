import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import axios from "axios";
import { env } from "../../config";

interface UserState {
  attendances: [];
  userId: 3;
}

interface UserState {
  email: string;
  role: string;
}

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckedIn, setCheckedIn] = useState(false);
  const [userData, setUserData] = useState<UserState>();
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

  const onNavigationClicked = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate]
  );

  const onCheckInOut = useCallback(async () => {
    if (isCheckedIn) {
      await axios.post(
        `${env.SERVER_URL}/api/Attendances/check-out/${userData?.userId}`
      );
    } else {
      await axios.post(
        `${env.SERVER_URL}/api/Attendances/check-in/${userData?.userId}`
      );
    }
  }, [isCheckedIn, userData?.userId]);

  useEffect(() => {
    if (user?.email) {
      axios.get(`${env.SERVER_URL}/api/Users/${user?.email}`).then((res) => {
        setUserData(res.data.user);
        if (!res.data.user.attendances[0]) {
          setCheckedIn(false);
        } else if (!res.data.user.attendances[0]?.attendanceOutTime) {
          setCheckedIn(true);
        } else if (res.data.user.attendances[0]?.attendanceOutTime) {
          setCheckedIn(false);
        }
      });
    }
  }, [user?.email]);

  return (
    <div className="mb-6 mt-2 flex justify-between">
      <div>
        <Button
          variant={location.pathname === "/" ? "secondary" : "link"}
          onClick={() => onNavigationClicked("/")}
        >
          Dashboard
        </Button>
        <Button
          variant={location.pathname === "/employees" ? "secondary" : "link"}
          onClick={() => onNavigationClicked("/employees")}
        >
          Employees
        </Button>
        <Button
          variant={location.pathname === "/departments" ? "secondary" : "link"}
          onClick={() => onNavigationClicked("/departments")}
        >
          departments
        </Button>
      </div>

      <div className="flex space-x-4">
        <Button
          variant={isCheckedIn ? "secondary" : "outline"}
          onClick={() => {
            onCheckInOut();
            setCheckedIn(!isCheckedIn);
          }}
        >
          Check {isCheckedIn ? "Out" : "In"}
        </Button>

        <Button
          variant="destructive"
          onClick={() => {
            localStorage.clear();
            navigate("/");
            window.location.reload();
          }}
        >
          Log Out
        </Button>

        <Avatar>
          <AvatarImage src={""} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
