import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const Attendance = () => {
  const { user } = useSelector((state) => state.auth);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Mock data for now
  useEffect(() => {
    setTimeout(() => {
      setAttendanceData([
        {
          childId: 1,
          childName: "Emma Johnson",
          className: "Preschool A",
          month: "December 2024",
          totalDays: 22,
          presentDays: 20,
          absentDays: 1,
          lateDays: 1,
          attendanceRate: 90.9,
          dailyRecords: [
            {
              date: "2024-12-01",
              status: "present",
              checkIn: "8:30 AM",
              checkOut: "3:30 PM",
            },
            {
              date: "2024-12-02",
              status: "present",
              checkIn: "8:15 AM",
              checkOut: "3:45 PM",
            },
            {
              date: "2024-12-03",
              status: "absent",
              checkIn: null,
              checkOut: null,
            },
            {
              date: "2024-12-04",
              status: "late",
              checkIn: "9:15 AM",
              checkOut: "3:30 PM",
            },
            {
              date: "2024-12-05",
              status: "present",
              checkIn: "8:30 AM",
              checkOut: "3:30 PM",
            },
            {
              date: "2024-12-06",
              status: "present",
              checkIn: "8:20 AM",
              checkOut: "3:40 PM",
            },
            {
              date: "2024-12-07",
              status: "present",
              checkIn: "8:25 AM",
              checkOut: "3:35 PM",
            },
            {
              date: "2024-12-08",
              status: "present",
              checkIn: "8:30 AM",
              checkOut: "3:30 PM",
            },
            {
              date: "2024-12-09",
              status: "present",
              checkIn: "8:20 AM",
              checkOut: "3:40 PM",
            },
            {
              date: "2024-12-10",
              status: "present",
              checkIn: "8:30 AM",
              checkOut: "3:30 PM",
            },
          ],
        },
        {
          childId: 2,
          childName: "Lucas Johnson",
          className: "Kindergarten B",
          month: "December 2024",
          totalDays: 22,
          presentDays: 21,
          absentDays: 0,
          lateDays: 1,
          attendanceRate: 95.5,
          dailyRecords: [
            {
              date: "2024-12-01",
              status: "present",
              checkIn: "8:15 AM",
              checkOut: "3:15 PM",
            },
            {
              date: "2024-12-02",
              status: "present",
              checkIn: "8:20 AM",
              checkOut: "3:20 PM",
            },
            {
              date: "2024-12-03",
              status: "present",
              checkIn: "8:25 AM",
              checkOut: "3:25 PM",
            },
            {
              date: "2024-12-04",
              status: "late",
              checkIn: "9:00 AM",
              checkOut: "3:15 PM",
            },
            {
              date: "2024-12-05",
              status: "present",
              checkIn: "8:15 AM",
              checkOut: "3:15 PM",
            },
            {
              date: "2024-12-06",
              status: "present",
              checkIn: "8:20 AM",
              checkOut: "3:20 PM",
            },
            {
              date: "2024-12-07",
              status: "present",
              checkIn: "8:25 AM",
              checkOut: "3:25 PM",
            },
            {
              date: "2024-12-08",
              status: "present",
              checkIn: "8:15 AM",
              checkOut: "3:15 PM",
            },
            {
              date: "2024-12-09",
              status: "present",
              checkIn: "8:20 AM",
              checkOut: "3:20 PM",
            },
            {
              date: "2024-12-10",
              status: "present",
              checkIn: "8:25 AM",
              checkOut: "3:25 PM",
            },
          ],
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "present":
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case "absent":
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      case "late":
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800";
      case "absent":
        return "bg-red-100 text-red-800";
      case "late":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">Attendance Records</h1>
        <p className="text-gray-600 mt-2">
          Monitor your children's daily attendance and punctuality
        </p>
      </div>

      {/* Month/Year Selector */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Month:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value={0}>January</option>
            <option value={1}>February</option>
            <option value={2}>March</option>
            <option value={3}>April</option>
            <option value={4}>May</option>
            <option value={5}>June</option>
            <option value={6}>July</option>
            <option value={7}>August</option>
            <option value={8}>September</option>
            <option value={9}>October</option>
            <option value={10}>November</option>
            <option value={11}>December</option>
          </select>

          <label className="text-sm font-medium text-gray-700">Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
          </select>
        </div>
      </div>

      {/* Attendance Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">
                Total Children
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {attendanceData.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">
                Average Attendance
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {Math.round(
                  attendanceData.reduce(
                    (acc, child) => acc + child.attendanceRate,
                    0
                  ) / attendanceData.length
                )}
                %
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">
                Total Late Days
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {attendanceData.reduce((acc, child) => acc + child.lateDays, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">
                Total Absent Days
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {attendanceData.reduce(
                  (acc, child) => acc + child.absentDays,
                  0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Individual Child Attendance */}
      {attendanceData.map((child) => (
        <div
          key={child.childId}
          className="bg-white rounded-lg shadow overflow-hidden"
        >
          {/* Child Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {child.childName}
                </h3>
                <p className="text-sm text-gray-600">{child.className}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Attendance Rate</p>
                <p className="text-2xl font-bold text-blue-600">
                  {child.attendanceRate}%
                </p>
              </div>
            </div>
          </div>

          {/* Attendance Stats */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-500">Total Days</p>
                <p className="text-lg font-semibold text-gray-900">
                  {child.totalDays}
                </p>
              </div>
              <div>
                <p className="text-sm text-green-600">Present</p>
                <p className="text-lg font-semibold text-green-600">
                  {child.presentDays}
                </p>
              </div>
              <div>
                <p className="text-sm text-red-600">Absent</p>
                <p className="text-lg font-semibold text-red-600">
                  {child.absentDays}
                </p>
              </div>
              <div>
                <p className="text-sm text-yellow-600">Late</p>
                <p className="text-lg font-semibold text-yellow-600">
                  {child.lateDays}
                </p>
              </div>
            </div>
          </div>

          {/* Daily Records */}
          <div className="px-6 py-4">
            <h4 className="text-md font-medium text-gray-900 mb-4">
              Daily Records
            </h4>
            <div className="space-y-2">
              {child.dailyRecords.map((record, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(record.status)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(record.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-gray-500">{record.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        record.status
                      )}`}
                    >
                      {record.status.charAt(0).toUpperCase() +
                        record.status.slice(1)}
                    </span>
                    {record.checkIn && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Check-in</p>
                        <p className="text-sm font-medium text-gray-900">
                          {record.checkIn}
                        </p>
                      </div>
                    )}
                    {record.checkOut && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Check-out</p>
                        <p className="text-sm font-medium text-gray-900">
                          {record.checkOut}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Attendance;
