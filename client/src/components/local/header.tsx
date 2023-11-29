import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { env } from "../../config";

interface UserState {
  attendances: [];
  userId: 3;
}

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckedIn, setCheckedIn] = useState(false);
  const [userData, setUserData] = useState<UserState>();
  const { logout, user } = useAuth0();

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
        {user?.nickname !== "admin" ? (
          <Button
            variant={isCheckedIn ? "secondary" : "outline"}
            onClick={() => {
              onCheckInOut();
              setCheckedIn(!isCheckedIn);
            }}
          >
            Check {isCheckedIn ? "Out" : "In"}
          </Button>
        ) : (
          <></>
        )}

        <Button
          variant="destructive"
          onClick={() => {
            logout({
              logoutParams: {
                returnTo: window.location.origin,
              },
            });
          }}
        >
          Log Out
        </Button>

        <Avatar>
          <AvatarImage src={user?.profile} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
