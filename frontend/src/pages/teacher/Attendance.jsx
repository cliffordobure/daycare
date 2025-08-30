import React, { useState, useEffect } from "react";
import {
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  PlusIcon,
  PencilIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChartBarIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const TeacherAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedClass, setSelectedClass] = useState("Preschool A");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockStudents = [
      {
        id: 1,
        name: "Emma Johnson",
        age: 4,
        photo: null,
        parentName: "John Johnson",
        parentPhone: "+1 (555) 123-4567",
        status: "active",
      },
      {
        id: 2,
        name: "Lucas Johnson",
        age: 6,
        photo: null,
        parentName: "John Johnson",
        parentPhone: "+1 (555) 123-4567",
        status: "active",
      },
      {
        id: 3,
        name: "Sophia Rodriguez",
        age: 5,
        photo: null,
        parentName: "Carlos Rodriguez",
        parentPhone: "+1 (555) 234-5678",
        status: "active",
      },
      {
        id: 4,
        name: "Maya Patel",
        age: 4,
        photo: null,
        parentName: "Priya Patel",
        parentPhone: "+1 (555) 345-6789",
        status: "active",
      },
      {
        id: 5,
        name: "Alex Chen",
        age: 5,
        photo: null,
        parentName: "Wei Chen",
        parentPhone: "+1 (555) 456-7890",
        status: "active",
      },
    ];

    const mockAttendance = [
      {
        id: 1,
        studentId: 1,
        date: "2024-12-10",
        status: "present",
        checkInTime: "8:30 AM",
        checkOutTime: "3:00 PM",
        notes: "Arrived on time, had a great day",
      },
      {
        id: 2,
        studentId: 2,
        date: "2024-12-10",
        status: "present",
        checkInTime: "8:15 AM",
        checkOutTime: "3:00 PM",
        notes: "Energetic and participated well in activities",
      },
      {
        id: 3,
        studentId: 3,
        date: "2024-12-10",
        status: "present",
        checkInTime: "8:45 AM",
        checkOutTime: "3:00 PM",
        notes: "Creative in art class, helped other children",
      },
      {
        id: 4,
        studentId: 4,
        date: "2024-12-10",
        status: "absent",
        checkInTime: null,
        checkOutTime: null,
        notes: "Called in sick by parent",
      },
      {
        id: 5,
        studentId: 5,
        date: "2024-12-10",
        status: "late",
        checkInTime: "9:15 AM",
        checkOutTime: "3:00 PM",
        notes: "Arrived late due to traffic",
      },
    ];

    setTimeout(() => {
      setStudents(mockStudents);
      setAttendance(mockAttendance);
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
        return <ClockIcon className="h-5 w-5 text-gray-600" />;
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

  const getAttendanceForDate = (date) => {
    return attendance.filter((record) => record.date === date);
  };

  const getStudentAttendance = (studentId, date) => {
    return attendance.find(
      (record) => record.studentId === studentId && record.date === date
    );
  };

  const handleStatusChange = (studentId, newStatus) => {
    const existingRecord = attendance.find(
      (record) => record.studentId === studentId && record.date === selectedDate
    );

    if (existingRecord) {
      // Update existing record
      setAttendance(
        attendance.map((record) =>
          record.id === existingRecord.id
            ? {
                ...record,
                status: newStatus,
                checkInTime: newStatus === "present" ? "8:30 AM" : null,
              }
            : record
        )
      );
    } else {
      // Create new record
      const newRecord = {
        id: Date.now(),
        studentId,
        date: selectedDate,
        status: newStatus,
        checkInTime: newStatus === "present" ? "8:30 AM" : null,
        checkOutTime: null,
        notes: "",
      };
      setAttendance([...attendance, newRecord]);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.parentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentDateAttendance = getAttendanceForDate(selectedDate);
  const presentCount = currentDateAttendance.filter(
    (record) => record.status === "present"
  ).length;
  const absentCount = currentDateAttendance.filter(
    (record) => record.status === "absent"
  ).length;
  const lateCount = currentDateAttendance.filter(
    (record) => record.status === "late"
  ).length;
  const totalStudents = students.length;
  const attendanceRate =
    totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Attendance Management
        </h1>
        <p className="text-gray-600">
          Track daily attendance and manage student check-ins
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Preschool A">Preschool A</option>
            <option value="Preschool B">Preschool B</option>
            <option value="Kindergarten A">Kindergarten A</option>
            <option value="Kindergarten B">Kindergarten B</option>
          </select>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Present</p>
              <p className="text-2xl font-bold text-gray-900">{presentCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Absent</p>
              <p className="text-2xl font-bold text-gray-900">{absentCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Late</p>
              <p className="text-2xl font-bold text-gray-900">{lateCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Attendance Rate
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {attendanceRate}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              Attendance for{" "}
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Note
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => {
                const studentAttendance = getStudentAttendance(
                  student.id,
                  selectedDate
                );
                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.age} years old
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(
                          studentAttendance?.status || "not-marked"
                        )}
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            studentAttendance?.status || "not-marked"
                          )}`}
                        >
                          {studentAttendance?.status || "Not Marked"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {studentAttendance?.checkInTime || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {studentAttendance?.checkOutTime || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {studentAttendance?.notes || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleStatusChange(student.id, "present")
                          }
                          className={`px-2 py-1 text-xs rounded ${
                            studentAttendance?.status === "present"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600 hover:bg-green-50"
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(student.id, "absent")
                          }
                          className={`px-2 py-1 text-xs rounded ${
                            studentAttendance?.status === "absent"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-600 hover:bg-red-50"
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          onClick={() => handleStatusChange(student.id, "late")}
                          className={`px-2 py-1 text-xs rounded ${
                            studentAttendance?.status === "late"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-600 hover:bg-yellow-50"
                          }`}
                        >
                          Late
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Weekly Attendance Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - date.getDay() + i);
            const dateStr = date.toISOString().split("T")[0];
            const dayAttendance = getAttendanceForDate(dateStr);
            const dayPresent = dayAttendance.filter(
              (record) => record.status === "present"
            ).length;
            const dayRate =
              totalStudents > 0
                ? Math.round((dayPresent / totalStudents) * 100)
                : 0;

            return (
              <div key={i} className="text-center">
                <div className="text-sm font-medium text-gray-900">
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
                <div className="text-xs text-gray-500">
                  {date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div
                  className={`mt-2 text-lg font-bold ${
                    dayRate >= 90
                      ? "text-green-600"
                      : dayRate >= 80
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {dayRate}%
                </div>
                <div className="text-xs text-gray-500">
                  {dayPresent}/{totalStudents}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Note Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Add Attendance Note
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter attendance note..."
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Add Note
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAttendance;
