import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Header from "./header";
import { useEffect, useState } from "react";
import axios from "axios";
import { env } from "../../config";
import { useAuth0 } from "@auth0/auth0-react";

interface StatisticsState {
  totalUsers: number;
  totalUsersWithBirthdays: number;
  totalAnniversaries: number;
  totalUsersActive: number;
}

interface AttendanceState {
  date: string;
  hours: number;
}

export default function Dashboard() {
  const { user } = useAuth0();
  const [statistics, setStatistics] = useState<StatisticsState>();
  const [attendanceData, setAttendanceData] = useState<AttendanceState[]>();

  useEffect(() => {
    axios.get(`${env.SERVER_URL}/api/Users/${user?.email}`).then((res) => {
      setAttendanceData(res.data.attendanceDatas);
    });

    axios.get(`${env.SERVER_URL}/api/Users/statistics`).then((res) => {
      setStatistics(res.data);
    });
  }, [user?.email]);

  return (
    <>
      <Header></Header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="py-14">
            <CardTitle className="text-5xl font-medium text-center">
              {statistics?.totalUsers}
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-green-700">
            <div className="text-xl font-bold text-center pt-8 pb-2">
              Total Employees
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-14">
            <CardTitle className="text-5xl font-medium text-center">
              {statistics?.totalUsersWithBirthdays}
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-blue-700">
            <div className="text-xl font-bold text-center pt-8 pb-2">
              Birthdays
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-14">
            <CardTitle className="text-5xl font-medium text-center">
              {statistics?.totalAnniversaries}
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-purple-700">
            <div className="text-xl font-bold text-center pt-8 pb-2">
              Anniversaries
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-full mb-6">
        <Card>
          <CardContent className="pt-2">
            <div className="aspect-video space-y-8">
              <h1 className="text-xl font-bold text-center">In/Out Report</h1>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData}>
                  <XAxis
                    dataKey="date"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Bar dataKey="hours" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
