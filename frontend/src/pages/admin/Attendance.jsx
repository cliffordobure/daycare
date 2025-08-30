import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  PencilIcon,
  EyeIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const Attendance = () => {
  const { user } = useSelector((state) => state.auth);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // Mock data for now
  useEffect(() => {
    setTimeout(() => {
      setAttendance([
        {
          id: 1,
          childId: 1,
          childName: "Emma Johnson",
          className: "Preschool A",
          date: "2024-12-10",
          status: "present",
          checkInTime: "8:30 AM",
          checkOutTime: "3:00 PM",
          totalHours: 6.5,
          lateArrival: false,
          earlyDeparture: false,
          notes: "Emma had a great day, participated in all activities",
          teacher: "Sarah Wilson",
          parentSignature: "John Johnson",
          photo: null,
        },
        {
          id: 2,
          childId: 2,
          childName: "Lucas Johnson",
          className: "Kindergarten B",
          date: "2024-12-10",
          status: "present",
          checkInTime: "8:15 AM",
          checkOutTime: "3:30 PM",
          totalHours: 7.25,
          lateArrival: false,
          earlyDeparture: false,
          notes: "Lucas excelled in math class today",
          teacher: "Michael Chen",
          parentSignature: "John Johnson",
          photo: null,
        },
        {
          id: 3,
          childId: 3,
          childName: "Sophia Rodriguez",
          className: "Preschool B",
          date: "2024-12-10",
          status: "present",
          checkInTime: "8:45 AM",
          checkOutTime: "2:45 PM",
          totalHours: 6.0,
          lateArrival: true,
          earlyDeparture: true,
          notes:
            "Sophia arrived late due to traffic, left early for doctor appointment",
          teacher: "Emily Davis",
          parentSignature: "Carlos Rodriguez",
          photo: null,
        },
        {
          id: 4,
          childId: 4,
          childName: "Aiden Thompson",
          className: "Toddler A",
          date: "2024-12-10",
          status: "absent",
          checkInTime: null,
          checkOutTime: null,
          totalHours: 0,
          lateArrival: false,
          earlyDeparture: false,
          notes: "Called in sick - fever and cough",
          teacher: "Jessica Brown",
          parentSignature: null,
          photo: null,
        },
        {
          id: 5,
          childId: 5,
          childName: "Isabella Chen",
          className: "Grade 1A",
          date: "2024-12-10",
          status: "present",
          checkInTime: "8:00 AM",
          checkOutTime: "4:00 PM",
          totalHours: 8.0,
          lateArrival: false,
          earlyDeparture: false,
          notes: "Perfect attendance, excellent participation",
          teacher: "Jennifer Smith",
          parentSignature: "James Chen",
          photo: null,
        },
        {
          id: 6,
          childId: 6,
          childName: "Maya Patel",
          className: "Preschool A",
          date: "2024-12-10",
          status: "late",
          checkInTime: "9:30 AM",
          checkOutTime: "3:00 PM",
          totalHours: 5.5,
          lateArrival: true,
          earlyDeparture: false,
          notes: "Arrived late due to family emergency",
          teacher: "Sarah Wilson",
          parentSignature: "Priya Patel",
          photo: null,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "text-green-600 bg-green-100";
      case "absent":
        return "text-red-600 bg-red-100";
      case "late":
        return "text-yellow-600 bg-yellow-100";
      case "half-day":
        return "text-blue-600 bg-blue-100";
      case "excused":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "present":
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case "absent":
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      case "late":
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />;
      case "half-day":
        return <ClockIcon className="h-5 w-5 text-blue-600" />;
      case "excused":
        return <ExclamationTriangleIcon className="h-5 w-5 text-purple-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const filteredAttendance = attendance.filter((record) => {
    const matchesDate = !selectedDate || record.date === selectedDate;
    const matchesClass =
      selectedClass === "all" || record.className === selectedClass;
    const matchesStatus =
      selectedStatus === "all" || record.status === selectedStatus;
    const matchesSearch =
      record.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.teacher.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesDate && matchesClass && matchesStatus && matchesSearch;
  });

  const uniqueClasses = [
    ...new Set(attendance.map((record) => record.className)),
  ];
  const uniqueStatuses = [
    ...new Set(attendance.map((record) => record.status)),
  ];

  const getAttendanceStats = () => {
    const total = attendance.length;
    const present = attendance.filter((r) => r.status === "present").length;
    const absent = attendance.filter((r) => r.status === "absent").length;
    const late = attendance.filter((r) => r.status === "late").length;
    const attendanceRate =
      total > 0 ? (((present + late) / total) * 100).toFixed(1) : 0;

    return { total, present, absent, late, attendanceRate };
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setShowAddModal(true);
  };

  const handleDelete = (recordId) => {
    if (
      window.confirm("Are you sure you want to delete this attendance record?")
    ) {
      setAttendance(attendance.filter((record) => record.id !== recordId));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = getAttendanceStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Attendance Management
            </h1>
            <p className="text-gray-600 mt-2">
              Track and manage daily attendance for all children
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Attendance Record
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Classes</option>
              {uniqueClasses.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Statuses</option>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-64">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by child name or teacher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedDate(new Date().toISOString().split("T")[0]);
              setSelectedClass("all");
              setSelectedStatus("all");
              setSearchTerm("");
            }}
            className="mt-6 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Summary Cards */}
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
                {stats.total}
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
              <p className="text-sm font-medium text-gray-500">Present</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.present}
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
              <p className="text-sm font-medium text-gray-500">Absent</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.absent}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">
                Attendance Rate
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.attendanceRate}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Attendance Records
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Child & Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check In/Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours & Notes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teacher & Parent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAttendance.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {record.photo ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={record.photo}
                            alt={record.childName}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-lg">👶</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {record.childName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {record.className}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {record.childId}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(record.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center mt-1">
                      {getStatusIcon(record.status)}
                      <span
                        className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          record.status
                        )}`}
                      >
                        {record.status.charAt(0).toUpperCase() +
                          record.status.slice(1)}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {record.checkInTime ? (
                        <div>
                          <div className="text-green-600">
                            ✓ {record.checkInTime}
                          </div>
                          {record.lateArrival && (
                            <span className="text-yellow-600 text-xs">
                              Late
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="text-red-600">✗ No check-in</div>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {record.checkOutTime ? (
                        <div>
                          <div className="text-blue-600">
                            ✓ {record.checkOutTime}
                          </div>
                          {record.earlyDeparture && (
                            <span className="text-yellow-600 text-xs">
                              Early
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-500">✗ No check-out</div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {record.totalHours > 0
                        ? `${record.totalHours} hours`
                        : "0 hours"}
                    </div>
                    {record.notes && (
                      <div
                        className="text-sm text-gray-500 mt-1 truncate max-w-xs"
                        title={record.notes}
                      >
                        {record.notes}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {record.teacher}
                    </div>
                    <div className="text-sm text-gray-500">
                      {record.parentSignature
                        ? `Signed by: ${record.parentSignature}`
                        : "No signature"}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(record)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          /* View details */
                        }}
                        className="text-green-600 hover:text-green-900 p-1"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete"
                      >
                        <XCircleIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAttendance.length === 0 && (
          <div className="text-center py-12">
            <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No attendance records found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters or check back later.
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingRecord ? "Edit Attendance" : "Add Attendance Record"}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {editingRecord
                  ? "Update attendance information"
                  : "Enter new attendance details"}
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingRecord(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingRecord ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
